using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.MaintenanceProcess;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class MachineMaintenanceProcessRepository : IMachineMaintenanceProcessRepository
    {

        private readonly AppDbContext _dbContext;

        public MachineMaintenanceProcessRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<MachineMaintenanceProcess?> AddAsync(MachineMaintenanceProcess machineMaintenanceProcess)
        {
            await _dbContext.MachineMaintenanceProcesses.AddAsync(machineMaintenanceProcess);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? machineMaintenanceProcess : null;
        }

        public async Task<SearchResponse<MachineMaintenanceProcess>> SearchAsync(
            List<long>? machineIds,
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

            if (from.HasValue)
            {
                query = query.Where(x => x.PlanDate >= from.Value);
            }

            if (to.HasValue)
            {
                query = query.Where(x => x.PlanDate <= to.Value);
            }

            var currentPage = Math.Max(page ?? 1, 1);
            var currentPageSize = Math.Max(pageSize ?? 10, 10);

            var totalItems = await query.CountAsync();

            var values = await query
                .OrderByDescending(x => x.PlanDate)
                .ThenBy(x => x.Id)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .ToListAsync();

            return new SearchResponse<MachineMaintenanceProcess>(
                currentPage,
                currentPageSize,
                totalItems,
                values);
        }
    }
}
