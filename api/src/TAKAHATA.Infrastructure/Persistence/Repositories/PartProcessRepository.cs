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

        public async Task<bool> UpdateWorkingTimeAsync(
            int id,
            double? workingTime,
            CancellationToken cancellationToken = default)
        {
            var affectedRows = await _dbContext.PartProcesses
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(
                        x => x.WorkingTime,
                        workingTime),
                    cancellationToken);

            return affectedRows > 0;
        }

        public async Task HandleExtend()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var partProcesses = await _dbContext.PartProcesses
                    .Where(pp =>
                        pp.PlantDate == today.AddDays(-1) &&
                        (pp.Status == ProcessStatus.Paused ||
                         pp.Status == ProcessStatus.PartiallyCompleted ||
                         pp.Status == ProcessStatus.InProgress ||
                         pp.Status == ProcessStatus.Planned))
                    .ToListAsync();

                if (partProcesses.Count == 0)
                    return;

                var overdueProcesses = new List<PartProcess>();

                // Tạm dừng hoặc hoàn thành một phần sẽ gia hạn sang ngày hôm sau
                foreach (var partProcess in partProcesses.Where(pp => pp.Status == ProcessStatus.Paused || pp.Status == ProcessStatus.PartiallyCompleted))
                {
                    var part = await _dbContext.Parts
                        .Include(p => p.Processes)
                        .FirstOrDefaultAsync(p => p.Id == partProcess.PartId);

                    if (part == null)
                        continue;

                    var processedQuantity = 0;

                    if (partProcess.ReferenceId == null)
                        processedQuantity = partProcess.ProcessedQuantity;
                    else
                    {
                        processedQuantity = _dbContext.PartProcesses
                            .Where(pp => pp.Id == partProcess.ReferenceId || pp.ReferenceId == partProcess.ReferenceId)
                            .Sum(pp => pp.ProcessedQuantity);
                    }

                    if (processedQuantity < part.Quantity)
                    {
                        if (await _dbContext.PartProcesses.AnyAsync(pp =>
                             pp.PlantDate == today
                             &&
                                ((partProcess.ReferenceId != null && pp.ReferenceId == partProcess.ReferenceId)
                                || pp.ReferenceId == partProcess.Id)))
                            continue;

                        partProcess.IsOverdue = true;

                        overdueProcesses.Add(new PartProcess
                        {
                            CreateAt = DateTime.Now,
                            CreateBy = partProcess.CreateBy,
                            UpdateAt = null,
                            UpdateBy = null,
                            MachineId = partProcess.MachineId,
                            PlantDate = today,
                            StartTime = null,
                            EndTime = null,
                            EstimatedTime = partProcess.EstimatedTime,
                            PerformedBy = null,
                            Note = partProcess.Note,
                            Status = partProcess.Status,
                            PartId = partProcess.PartId,
                            Sequence = part.Processes.Count,
                            WorkingTime = null,
                            SetupTime = null,
                            WaitingTime = null,
                            ProgrammingTime = 0,
                            AssemblyTime = null,
                            MeasurementTime = null,
                            ProcessedQuantity = 0,
                            WorkerNote = string.Empty,
                            IsOverdue = true,
                            ReferenceId = partProcess.ReferenceId.HasValue ? partProcess.ReferenceId : partProcess.Id
                        });
                    }
                    else if (processedQuantity == part.Quantity)
                    {
                        partProcess.Status = ProcessStatus.Completed;
                    }
                }

                await _dbContext.PartProcesses.AddRangeAsync(overdueProcesses);

                // Đang gia công chưa xong hoặc chưa gia công sẽ chuyển tiếp sang ngày hôm sau
                var updateProcesses = new List<PartProcess>();
                foreach (var partProcess in partProcesses.Where(pp => pp.Status == ProcessStatus.InProgress || pp.Status == ProcessStatus.Planned))
                {
                    partProcess.PlantDate = today;
                    updateProcesses.Add(partProcess);
                }
                _dbContext.PartProcesses.UpdateRange(updateProcesses);

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<SearchResponse<List<ManufacturingProcessResponse>>> SearchByMachineIdAsync(
            int machineId,
            int? page,
            int? pageSize)
        {
            var currentPage = Math.Max(page ?? 1, 1);
            var currentPageSize = Math.Clamp(pageSize ?? 10, 1, 100);

            var today = DateOnly.FromDateTime(DateTime.Now);

            var partProcesses = _dbContext.PartProcesses
                .AsNoTracking()
                .Where(x => x.MachineId == machineId && x.PlantDate == today);

            var totalItems = await partProcesses.CountAsync();

            var data = await partProcesses
                .OrderByDescending(x => x.Status)
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

                    ProcessedQuantity = x.ProcessedQuantity,
                    TotalProcessedQuantity = x.ReferenceId == null ? x.ProcessedQuantity : _dbContext.PartProcesses.Where(pp => pp.Id == x.ReferenceId || pp.ReferenceId == x.ReferenceId).Sum(pp => pp.ProcessedQuantity),

                    IndexId = x.Part != null
                        ? x.Part.IndexId
                        : 0,
                    IndexCode = x.Part != null && x.Part.Index != null
                        ? x.Part.Index.Code ?? string.Empty
                        : string.Empty,

                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    EstimatedTime = x.EstimatedTime,
                    WorkerNote = x.WorkerNote,
                    WaitingTime = x.WaitingTime,
                    WorkingTime = x.WorkingTime,
                    PerformedBy = x.PerformedBy,
                    SetupTime = x.SetupTime,
                    ProgrammingTime = x.ProgrammingTime,
                    Prioritize = x.Part != null ? x.Part.Prioritize : false,

                    Note = x.Note ?? string.Empty,
                    Status = x.Part != null && x.Part.Status == ProcessStatus.PendingApproval ? ProcessStatus.PendingApproval : x.Status,
                    ProcessType = ManufacturingProcessType.PartProcess,
                    IsOverdue = x.IsOverdue,
                    TotalTime = (x.WorkingTime ?? 0) + (x.SetupTime ?? 0) + (x.WaitingTime ?? 0) + (x.ProgrammingTime ?? 0),
                    IsSettingUp = x.IsSettingUp,
                })
                .ToListAsync();

            var maintenanceProcesses = await _dbContext.MachineMaintenanceProcesses
                .AsNoTracking()
                .Where(x => x.MachineId == machineId && x.PlantDate == today)
                .ToListAsync();

            foreach (var x in maintenanceProcesses)
            {
                data.Add(new ManufacturingProcessResponse
                {
                    Id = x.Id,
                    CreateAt = x.CreateAt,
                    CreateBy = x.CreateBy,
                    UpdateAt = x.UpdateAt,
                    UpdateBy = x.UpdateBy,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    EstimatedTime = x.EstimatedTime,
                    PerformedBy = x.PerformedBy,
                    Prioritize = true,

                    Note = x.Note ?? string.Empty,
                    Status = x.Status,
                    PartCode = "Bảo trì",
                    ProcessType = ManufacturingProcessType.MaintenanceProcesses,
                });
            }

            return new SearchResponse<List<ManufacturingProcessResponse>>(
                currentPage,
                currentPageSize,
                totalItems,
                data);
        }

        public async Task<List<PartProcessKPIResponse>> SearchKPIAsync(
            string? searchMachineKeyword,
            string? searchIndexKeyword,
            string? searchPartKeyword,
            DateTime from,
            DateTime to)
        {
            const int batchSize = 2000;

            var query = _dbContext.PartProcesses
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchMachineKeyword))
            {
                var ms = await _dbContext.Machines
                    .Where(m => m.Name.Contains(searchMachineKeyword) || m.Code.Contains(searchMachineKeyword))
                    .Select(m => m.Id).ToListAsync();

                if (ms != null && ms.Count != 0)
                    query = query.Where(p => ms.Contains(p.MachineId));
                else
                    return [];
            }

            if (!string.IsNullOrEmpty(searchIndexKeyword))
            {
                var idxIds = await _dbContext.Indexes.Where(i => i.Code.Contains(searchIndexKeyword)).Select(i => i.Id).ToListAsync();
                if (idxIds != null && idxIds.Count != 0)
                {
                    var partIds = await _dbContext.Parts.Where(p => idxIds.Contains(p.IndexId)).Select(p => p.Id).ToListAsync();
                    if (partIds != null && partIds.Count != 0)
                        query = query.Where(p => partIds.Contains(p.PartId));
                    else
                        return [];
                }
                else
                    return [];
            }

            if (!string.IsNullOrEmpty(searchPartKeyword))
            {
                var partIds = await _dbContext.Parts.Where(p => p.Code.Contains(searchPartKeyword)).Select(p => p.Id).ToListAsync();
                if (partIds != null && partIds.Count != 0)
                    query = query.Where(p => partIds.Contains(p.PartId));
                else
                    return [];
            }

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
                    ProgrammingTime = pp.ProgrammingTime,
                    TotalTime = (pp.WorkingTime ?? 0) + (pp.SetupTime ?? 0) + (pp.WaitingTime ?? 0) + (pp.ProgrammingTime ?? 0),
                    MachineId = pp.MachineId,
                    EstimatedTime = pp.EstimatedTime,
                    PartType = p.PartType,
                    ProcessedQuantity = pp.ProcessedQuantity
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

        public async Task<int> GetProcessedQuantityByReferenceId(int? referenceId)
        {
            if (!referenceId.HasValue)
                return 0;

            return _dbContext.PartProcesses
                   .Where(pp => pp.Id == referenceId || pp.ReferenceId == referenceId)
                   .Sum(pp => pp.ProcessedQuantity);
        }

        public async Task<List<int>> GetPrioritizeMachineIdsByMachineIdsAndDateAsync(List<int> machineIds, DateTime date)
        {
            var dateOnly = DateOnly.FromDateTime(date);
            var query = _dbContext.PartProcesses.AsNoTracking().AsQueryable();

            query = query.Where(pp => pp.PlantDate != null && pp.PlantDate.Value == dateOnly && pp.Part != null && pp.Part.Prioritize);

            if (machineIds.Count != 0)
                query = query.Where(pp => machineIds.Contains(pp.MachineId));

            return await query.Select(pp => pp.MachineId).ToListAsync();
        }
    }
}
