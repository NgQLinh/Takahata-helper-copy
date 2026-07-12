using ErrorOr;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class MachineRepository : BaseRepository<Machine>, IMachineRepository
    {
        private readonly IMapper _mapper;

        public MachineRepository(
            AppDbContext dbContext,
            IMapper mapper) : base(dbContext)
        {
            _mapper = mapper;
        }

        public async Task<bool> IsExistedAsync(string name, string code)
        {
            var machine = await _dbContext.Machines
                .FirstOrDefaultAsync(m => m.Name == name || m.Code == code);
            return machine != null;
        }

        public async Task<SearchResponse<List<MachineResponse>>> Search(
            string? keyWord,
            int? page,
            int? pageSize)
        {
            var query = _dbContext.Machines
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyWord))
            {
                var searchText = keyWord.Trim();

                query = query.Where(x =>
                    x.Name.Contains(searchText) ||
                    x.Code.Contains(searchText) ||
                    x.Brand.Contains(searchText));
            }

            var currentPage = Math.Max(page ?? 1, 1);
            var currentPageSize = Math.Clamp(pageSize ?? 10, 1, 100);

            var totalItems = await query.CountAsync();

            var sql = query.ToQueryString();

            var values = await query
                .OrderByDescending(x => x.CreateAt)
                    .ThenBy(x => x.Id)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .ToListAsync();

            var data = values
                .Select(v => _mapper.Map<MachineResponse>(v))
                .ToList();

            return new SearchResponse<List<MachineResponse>>(
                       currentPage,
                       currentPageSize,
                       totalItems,
                       data);
        }

        public async Task<bool> IsExistedExceptIdAsync(string name, string code, long id)
        {
            var machine = await _dbContext.Machines
                .FirstOrDefaultAsync(m => (m.Name == name || m.Code == code) && m.Id != id);
            return machine != null;
        }

        public async Task<IEnumerable<Machine>> GetAsync()
        {
            return await _dbContext.Machines
                .Include(m => m.PartProcesses)
                .ToListAsync();
        }
    }
}
