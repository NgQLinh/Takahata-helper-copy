using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class PartProcessRepository : BaseRepository<PartProcess>, IPartProcessRepository
    {
        public PartProcessRepository(AppDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<SearchResponse<List<ManufacturingProcessResponse>>> SearchByMachineIdAsync(
            long machineId,
            int? page,
            int? pageSize)
        {
            var currentPage = Math.Max(page ?? 1, 1);
            var currentPageSize = Math.Clamp(pageSize ?? 10, 1, 100);

            var query = _dbContext.PartProcesses
                .AsNoTracking()
                .Where(x => x.MachineId == machineId);

            var totalItems = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreateAt)
                .ThenByDescending(x => x.Id)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .Select(x => new ManufacturingProcessResponse
                {
                    Id = x.Id,
                    CreateAt = x.CreateAt,
                    CreateBy = x.CreateBy,
                    UpdateAt = x.UpdateAt,
                    UpdateBy = x.UpdateBy,

                    PartId = x.Part != null ? x.Part.Id : 0,
                    PartCode = x.Part != null
                        ? x.Part.Code ?? string.Empty
                        : string.Empty,
                    Quantity = x.Part != null
                        ? x.Part.Quantity
                        : 0,

                    IndexId = x.Part != null
                        ? x.Part.IndexId
                        : 0,
                    IndexCode = x.Part != null && x.Part.Index != null
                        ? x.Part.Index.Code ?? string.Empty
                        : string.Empty,

                    Note = x.Note,
                    Status = x.Part != null && x.Part.Status == ProcessStatus.PendingApproval ? ProcessStatus.PendingApproval : x.Status
                })
                .ToListAsync();

            return new SearchResponse<List<ManufacturingProcessResponse>>(
                currentPage,
                currentPageSize,
                totalItems,
                data);
        }
    }
}
