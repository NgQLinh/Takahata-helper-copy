using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Contracts.Report;
using TAKAHATA.Domain.MasterData;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class PartProcessRepository : BaseRepository<PartProcess>, IPartProcessRepository
    {
        public PartProcessRepository(AppDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<SearchResponse<List<ManufacturingProcessResponse>>> SearchByMachineIdAsync(
            int machineId,
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

                    Note = x.Note ?? string.Empty,
                    Status = x.Part != null && x.Part.Status == ProcessStatus.PendingApproval ? ProcessStatus.PendingApproval : x.Status
                })
                .ToListAsync();

            return new SearchResponse<List<ManufacturingProcessResponse>>(
                currentPage,
                currentPageSize,
                totalItems,
                data);
        }

        public async Task<List<PartProcessKPIResponse>> SearchKPIAsync(DateTime from, DateTime to)
        {
            const int batchSize = 2000;

            var query = _dbContext.PartProcesses
                .AsNoTracking()
                .AsQueryable();

            query = query
                .Where(p => p.StartTime != null && p.StartTime.Value.Date >= from.Date && p.StartTime.Value.Date <= to.Date);

            var result = query.Join(
                _dbContext.Parts.AsNoTracking(),
                pp => pp.PartId,
                p => p.Id,
                (pp, p) => new PartProcessKPIResponse
                {
                    // Part
                    PartId = p.Id,
                    PartCode = p.Code,
                    Quantity = p.Quantity,
                    ProcessedQuantity = p.ProcessedQuantity,
                    IndexId = p.IndexId,

                    // PartProcess
                    PartProcessId = pp.Id,
                    PlantDate = pp.PlantDate,
                    StartTime = pp.StartTime,
                    EndTime = pp.EndTime,
                    Status = pp.Status,
                    SetupTime = pp.SetupTime,
                    WaitingTime = pp.WaitingTime,
                    WorkingTime = pp.WorkingTime,
                    MachineId = pp.MachineId,
                });

            var partProcesses = await result.ToListAsync();

            // Lấy thông tin machines
            var machineIds = partProcesses
                .Select(p => p.MachineId)
                .Distinct()
                .ToList();

            var machines = await _dbContext.Machines
                .Where(m => machineIds.Contains(m.Id))
                .ToListAsync();

            // Lấy thông tin indexes
            var indexIds = partProcesses
                .Select(p => p.IndexId)
                .Distinct()
                .ToList();

            var indexes = new List<Index>();
            foreach (var batch in indexIds.Chunk(batchSize))
            {
                indexes.AddRange(await _dbContext.Indexes
                    .Where(p => batch.Contains(p.Id))
                    .ToListAsync());
            }

            foreach (var partProcess in partProcesses)
            {
                var machine = machines.FirstOrDefault(m => m.Id == partProcess.MachineId);
                if (machine != null)
                {
                    partProcess.MachineName = machine.Name;
                    partProcess.MachineCode = machine.Code;
                }

                var index = indexes.FirstOrDefault(i => i.Id == partProcess.IndexId);
                if (index != null)
                {
                    partProcess.IndexCode = index.Code;
                }
            }

            return partProcesses;
        }
    }
}
