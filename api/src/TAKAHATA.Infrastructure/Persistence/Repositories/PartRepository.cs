using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class PartRepository : BaseRepository<Part>, IPartRepository
    {
        private readonly IMapper _mapper;

        public PartRepository(
            AppDbContext dbContext,
            IMapper mapper) : base(dbContext)
        {
            _mapper = mapper;
        }

        public async Task<SearchResponse<List<PartResponse>>> SearchAsync(
            string? searchText,
            List<ProcessStatus>? statuses,
            DateOnly? planFrom,
            DateOnly? planTo,
            DateOnly? actualFrom,
            DateOnly? actualTo,
            int page,
            int pageSize)
        {

            var query = _dbContext.PartProcesses
                .AsNoTracking()
                .AsQueryable();

            // Tìm kiếm theo Part.Code
            var partIds = new List<long>();

            if (!string.IsNullOrEmpty(searchText))
                partIds = _dbContext.Parts.Where(p => p.Code.Contains(searchText.Trim())).Select(p => p.Id).ToList();

            if (partIds.Count != 0)
                query = query.Where(x => partIds.Contains(x.PartId));

            // Lọc theo trạng thái
            if (statuses is { Count: > 0 })
            {
                query = query.Where(x =>
                    statuses.Contains(x.Status));
            }

            // Lọc ngày kế hoạch
            if (planFrom.HasValue)
            {
                query = query.Where(x =>
                    x.PlanDate >= planFrom.Value);
            }

            if (planTo.HasValue)
            {
                query = query.Where(x =>
                    x.PlanDate <= planTo.Value);
            }

            // Lọc ngày thực tế
            if (actualFrom.HasValue)
            {
                query = query.Where(x =>
                    x.ActualDate >= actualFrom.Value);
            }

            if (actualTo.HasValue)
            {
                query = query.Where(x =>
                    x.ActualDate <= actualTo.Value);
            }

            var currentPage = Math.Max(page, 1);
            var currentPageSize = Math.Clamp(pageSize, 1, 100);

            var totalItems = await _dbContext.Parts.CountAsync();

            partIds = await query
                .OrderByDescending(x => x.PlanDate)
                .GroupBy(x => x.PartId)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .Select(x => x.Key)
                .ToListAsync();

            var parts = await _dbContext.Parts
                .Where(p => partIds.Contains(p.Id))
                .Include(p => p.Index)
                .Include(p => p.Processes)
                .ThenInclude(pp => pp.Machine)
                .AsNoTracking()
                .OrderBy(x => x.Id)
                .ToListAsync();

            var data = parts
                .Select(x => _mapper.Map<PartResponse>(x))
                .ToList();

            return new SearchResponse<List<PartResponse>>(
                currentPage,
                currentPageSize,
                totalItems,
                data);
        }

        public async Task<bool> IsExistedAsync(string partCode)
        {
            var part = await _dbContext.Parts.FirstOrDefaultAsync(p => p.Code == partCode);
            return part != null;
        }

        public override async Task<Part?> GetByIdAsync(long id)
        {
            return await _dbContext.Parts
                .Include(p => p.Index)
                .Include(p => p.Processes)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<int> CountTotal()
        {
            return await _dbContext.Parts.CountAsync();
        }
    }
}
