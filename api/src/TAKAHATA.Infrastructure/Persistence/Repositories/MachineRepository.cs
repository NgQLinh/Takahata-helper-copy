using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

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


        public async Task CreateDefaultMachine()
        {
            var defaultMachines = new List<Machine>
            {
                new()
                {
                    Code = "28",
                    Type = "EDM",
                    Name = "AgieCharmilles Form 300",
                    Brand = "AgieCharmilles"
                },
                new()
                {
                    Code = "22",
                    Type = "EDM",
                    Name = "Sodick AG40L",
                    Brand = "Sodick"
                },
                new()
                {
                    Code = "24",
                    Type = "EDM",
                    Name = "Sodick AG60L",
                    Brand = "Sodick"
                },
                new()
                {
                    Code = "46",
                    Type = "Wire cut",
                    Name = "Sodick ALN600G",
                    Brand = "Sodick"
                },
                new()
                {
                    Code = "23",
                    Type = "Wire cut",
                    Name = "Sodick VZ300L",
                    Brand = "Sodick"
                },
                new()
                {
                    Code = "25",
                    Type = "Milling Center",
                    Name = "Okuma MB-46VA",
                    Brand = "Okuma"
                },
                new()
                {
                    Code = "61",
                    Type = "Milling Center",
                    Name = "Okuma MB-56VB",
                    Brand = "Okuma"
                },
                new()
                {
                    Code = "2",
                    Type = "Milling Center",
                    Name = "Fanuc D21MIA",
                    Brand = "Fanuc"
                },
                new()
                {
                    Code = "19",
                    Type = "Surface Grinding",
                    Name = "Okamoto ACC64ST",
                    Brand = "Okamoto"
                },
                new()
                {
                    Code = "38",
                    Type = "Surface Grinding",
                    Name = "Okamoto ACC52DX",
                    Brand = "Okamoto"
                },
                new()
                {
                    Code = "42",
                    Type = "Cylinder Grinding",
                    Name = "Mitsui MSG-818PC-NC",
                    Brand = "Mitsui"
                },
                new()
                {
                    Code = "20",
                    Type = "Cylinder Grinding",
                    Name = "Okamoto Max 15N-ID",
                    Brand = "Okamoto"
                },
                new()
                {
                    Code = "41",
                    Type = "Cylinder Grinding",
                    Name = "SHIGIYA GPS-30B.50",
                    Brand = "SHIGIYA"
                },
                new()
                {
                    Code = "5",
                    Type = "Lathe",
                    Name = "Okuma L250",
                    Brand = "Okuma"
                },
                new()
                {
                    Code = "58",
                    Type = "Lathe",
                    Name = "Citizen A20",
                    Brand = "Citizen"
                },
                new()
                {
                    Code = "55",
                    Type = "NC Milling",
                    Name = "Yamasaki YZ-352NCR",
                    Brand = "Yamasaki"
                },
                new()
                {
                    Code = "3",
                    Type = "NC Milling",
                    Name = "Shizuoka VHR-AN",
                    Brand = "Shizuoka"
                },
                new()
                {
                    Code = "1",
                    Type = "Hobbing",
                    Name = "Hamai 60SP-NC",
                    Brand = "Hamai"
                },
                new()
                {
                    Code = "60",
                    Type = "Hobbing",
                    Name = "Hamai 60SP-ETL",
                    Brand = "Hamai"
                },
                new()
                {
                    Code = "59",
                    Type = "Hole drill",
                    Name = "Sodick K1C",
                    Brand = "Sodick"
                }
            };

            if (!await _dbContext.Machines.AnyAsync())
            {
                await _dbContext.Machines.AddRangeAsync(defaultMachines);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<bool> IsExistedAsync(string name, string code)
        {
            var machine = await _dbContext.Machines
                .FirstOrDefaultAsync(m => m.Name == name || m.Code == code);
            return machine != null;
        }

        public async Task<SearchResponse<List<MachineResponse>>> SearchAsync(
            string? keyword,
            int? page,
            int? pageSize)
        {
            var query = _dbContext.Machines
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var searchText = keyword.Trim();

                query = query.Where(x =>
                    x.Name.Contains(searchText) ||
                    x.Code.Contains(searchText) ||
                    x.Brand.Contains(searchText));
            }

            var currentPage = Math.Max(page ?? 1, 1);
            var currentPageSize = Math.Clamp(pageSize ?? 10, 1, 100);

            var totalItems = await query.CountAsync();

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

        public async Task<SearchResponse<List<MachineScheduleResponse>>> SearchSchedule(
            string keyword,
            DateOnly? plantFrom,
            DateOnly? plantTo,
            int page,
            int pageSize)
        {
            var query = _dbContext.PartProcesses
                .AsNoTracking()
                .AsQueryable();

            // Tìm kiếm theo mã máy
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim();

                query = query.Where(x =>
                    x.Machine != null &&
                    (x.Machine.Code.Contains(keyword) || x.Machine.Name.Contains(keyword)));
            }

            if (plantFrom.HasValue)
                query = query.Where(x => x.PlantDate >= plantFrom.Value);

            if (plantTo.HasValue)
                query = query.Where(x => x.PlantDate <= plantTo.Value);

            var currentPage = Math.Max(page, 1);
            var currentPageSize = Math.Clamp(pageSize, 1, 100);

            var groupedQuery = query
                .GroupBy(x => x.MachineId)
                .Select(group => new
                {
                    MachineId = group.Key,
                    LatestPlantDate = group.Max(x => x.PlantDate)
                });

            var totalItems = await groupedQuery.CountAsync();

            var pagedMachineIds = await groupedQuery
                .OrderByDescending(x => x.LatestPlantDate)
                .ThenBy(x => x.MachineId)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .Select(x => x.MachineId)
                .ToListAsync();

            var machines = await _dbContext.Machines
                .AsNoTracking()
                .Where(x => pagedMachineIds.Contains(x.Id))
                .Include(x => x.MachineMaintenanceProcesses)
                .Include(x => x.PartProcesses)
                    .ThenInclude(x => x.Part)
                .ToListAsync();

            var data = machines
                .Select(x => _mapper.Map<MachineScheduleResponse>(x))
                .ToList();

            foreach (var item in data)
            {
                var machine = machines.FirstOrDefault(x => x.Id == item.Id);
                if (machine == null)
                    continue;

                foreach (var partProcess in machine.PartProcesses)
                {
                    var process = new MachineProcessResponse
                    {
                        Id = partProcess.Id,
                        CreateAt = partProcess.CreateAt,
                        CreateBy = partProcess.CreateBy,
                        Note = partProcess.Note,
                        PartCode = partProcess.Part != null ? partProcess.Part.Code : string.Empty,
                        PartId = partProcess.PartId,
                        Quantity = partProcess.Part != null ? partProcess.Part.Quantity : 0,
                        Status = partProcess.Status,
                        UpdateAt = partProcess.UpdateAt,
                        UpdateBy = partProcess.UpdateBy,
                        PlantDate = partProcess.PlantDate,
                        ActualDate = partProcess.ActualDate,
                        WorkingTime = partProcess.WorkingTime,
                        Type = MachineProcessType.Manufacturing
                    };

                    item.Processes.Add(process);
                }

                foreach (var machineMaintenanceProcess in machine.MachineMaintenanceProcesses)
                {
                    var process = new MachineProcessResponse
                    {
                        Id = machineMaintenanceProcess.Id,
                        CreateAt = machineMaintenanceProcess.CreateAt,
                        CreateBy = machineMaintenanceProcess.CreateBy,
                        Note = machineMaintenanceProcess.Note ?? string.Empty,
                        PartCode = string.Empty,
                        Quantity = 0,
                        Status = machineMaintenanceProcess.Status,
                        UpdateAt = machineMaintenanceProcess.UpdateAt,
                        UpdateBy = machineMaintenanceProcess.UpdateBy,
                        PlantDate = machineMaintenanceProcess.PlantDate,
                        ActualDate = machineMaintenanceProcess.ActualDate,
                        WorkingTime = machineMaintenanceProcess.WorkingTime,
                        Type = MachineProcessType.Maintenance
                    };

                    item.Processes.Add(process);
                }
            }

            return new SearchResponse<List<MachineScheduleResponse>>(
                currentPage,
                currentPageSize,
                totalItems,
                data);
        }
    }
}
