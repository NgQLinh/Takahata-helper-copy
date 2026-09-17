using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class MachineMaintenanceProcessRepository : BaseRepository<MachineMaintenanceProcess>, IMachineMaintenanceProcessRepository
    {
        private readonly IMapper _mapper;

        public MachineMaintenanceProcessRepository(AppDbContext dbContext, IMapper mapper) : base(dbContext)
        {
            _mapper = mapper;
        }

        public async Task<List<MachineMaintenanceProcess>> GetByMachineIdsAndDateAsync(IEnumerable<int> machineIds, DateTime date)
        {
            var query = _dbContext.MachineMaintenanceProcesses
                .AsNoTracking()
                .AsQueryable();

            query = query
                .Where(mp => machineIds.Contains(mp.MachineId));

            query = query
                .Where(mp => mp.PlantDate == new DateOnly(date.Year, date.Month, date.Day));

            return await query.ToListAsync();
        }

        public async Task<SearchResponse<List<MachineMaintenanceProcessResponse>>> SearchAsync(
            List<int>? machineIds,
            List<ProcessStatus>? statuses,
            DateOnly? from,
            DateOnly? to,
            int? page,
            int? pageSize)
        {
            var query = _dbContext.MachineMaintenanceProcesses
                .AsNoTracking()
                .AsQueryable();

            if (machineIds is { Count: > 0 })
            {
                query = query.Where(x => machineIds.Contains(x.MachineId));
            }

            if (statuses is { Count: > 0 })
            {
                query = query.Where(x => statuses.Contains(x.Status));
            }

            if (from.HasValue)
            {
                query = query.Where(x => x.PlantDate >= from.Value);
            }

            if (to.HasValue)
            {
                query = query.Where(x => x.PlantDate <= to.Value);
            }

            var currentPage = Math.Max(page ?? 1, 1);
            var currentPageSize = Math.Clamp(pageSize ?? 10, 1, 100);

            var totalItems = await query.CountAsync();

            var values = await query
                .OrderByDescending(x => x.PlantDate)
                .ThenBy(x => x.Id)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .Include(x => x.Machine)
                .ToListAsync();

            var data = values
                .Select(v => _mapper.Map<MachineMaintenanceProcessResponse>(v))
                .ToList();

            return new SearchResponse<List<MachineMaintenanceProcessResponse>>(
                currentPage,
                currentPageSize,
                totalItems,
                data);
        }
    }
}
