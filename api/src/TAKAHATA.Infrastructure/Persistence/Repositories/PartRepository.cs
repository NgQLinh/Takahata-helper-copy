using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
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

        public override async Task<Part?> DeleteByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            if (_dbContext.PartProcesses.Any(p => p.PartId == id && p.Status != ProcessStatus.Planned))
                return null;

            return await base.DeleteByIdAsync(id, cancellationToken);
        }

        public async Task<SearchResponse<List<PartResponse>>> SearchAsync(
            string? searchText,
            List<ProcessStatus>? statuses,
            DateOnly? plantFrom,
            DateOnly? plantTo,
            DateTime? startFrom,
            DateTime? startTo,
            int page,
            int pageSize)
        {
            var query = _dbContext.PartProcesses
                .AsNoTracking()
                .AsQueryable();

            // Tìm kiếm theo mã Part
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                var keyword = searchText.Trim();

                query = query.Where(x =>
                    x.Part != null &&
                    x.Part.Code.Contains(keyword));
            }

            // Lọc theo trạng thái
            if (statuses is { Count: > 0 })
            {
                query = query.Where(x => statuses.Contains(x.Status));
            }

            // Lọc ngày kế hoạch
            if (plantFrom.HasValue)
            {
                query = query.Where(x =>
                    x.PlantDate.HasValue &&
                    x.PlantDate.Value >= plantFrom.Value);
            }

            if (plantTo.HasValue)
            {
                query = query.Where(x =>
                    x.PlantDate.HasValue &&
                    x.PlantDate.Value <= plantTo.Value);
            }

            // Lọc ngày thực tế
            if (startFrom.HasValue)
            {
                query = query.Where(x =>
                    x.StartTime.HasValue &&
                    x.StartTime.Value.Date >= startFrom.Value);
            }

            if (startTo.HasValue)
            {
                query = query.Where(x =>
                    x.StartTime.HasValue &&
                    x.StartTime.Value.Date <= startTo.Value);
            }

            var currentPage = Math.Max(page, 1);
            var currentPageSize = Math.Clamp(pageSize, 1, 100);

            // Mỗi Part chỉ được tính là một item
            var groupedQuery = query
                .GroupBy(x => x.PartId)
                .Select(group => new
                {
                    PartId = group.Key,
                    LatestPlantDate = group.Max(x => x.PlantDate)
                });

            var totalItems = await groupedQuery.CountAsync();

            var pagedPartIds = await groupedQuery
                .OrderByDescending(x => x.LatestPlantDate)
                .ThenBy(x => x.PartId)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .Select(x => x.PartId)
                .ToListAsync();

            var parts = await _dbContext.Parts
                .AsNoTracking()
                .Where(x => pagedPartIds.Contains(x.Id))
                .Include(x => x.Index)
                .Include(x => x.Processes)
                .ToListAsync();

            // Giữ đúng thứ tự phân trang ban đầu
            var partOrder = pagedPartIds
                .Select((id, index) => new { id, index })
                .ToDictionary(x => x.id, x => x.index);

            parts = parts
                .OrderBy(x => partOrder[x.Id])
                .ToList();

            var machines = _dbContext.Machines.ToList();

            var data = parts
                .Select(x =>
                {
                    var part = _mapper.Map<PartResponse>(x);
                    part.Processes = part.Processes
                        .OrderBy(p => p.Sequence)
                        .ToList();

                    foreach (var processes in part.Processes)
                    {
                        var machine = machines.FirstOrDefault(m => m.Id == processes.MachineId);
                        if (machine != null)
                            processes.Machine = _mapper.Map<MachineResponse>(machine);
                    }

                    return part;
                })
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

        public async Task<Part?> ApproveAsync(int id)
        {
            var part = _dbContext.Parts.FirstOrDefault(x => x.Id == id);
            if (part == null)
                return null;

            part.Status = ProcessStatus.Planned;
            _dbContext.Parts.Update(part);

            var effectedRow = await _dbContext.SaveChangesAsync();

            return effectedRow != 0 ? part : null;
        }

        public async Task<IEnumerable<Part>> GetByIdsAsync(HashSet<long> partIds)
        {
            return await _dbContext.Parts
                .Where(p => partIds.Contains(p.Id))
                .ToListAsync();
        }
    }
}
