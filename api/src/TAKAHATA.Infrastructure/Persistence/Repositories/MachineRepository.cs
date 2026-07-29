using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Repositories;
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
            return await _dbContext.Machines.ToListAsync();
        }

        public async Task<SearchResponse<List<MachineScheduleResponse>>> SearchSchedule(
       string? keyword,
       DateOnly? plantFrom,
       DateOnly? plantTo,
       int page,
       int pageSize)
        {
            var currentPage = Math.Max(page, 1);
            var currentPageSize = Math.Clamp(pageSize, 1, 100);

            keyword = keyword?.Trim();

           var machineIds = _dbContext.Machines
                .Where(x =>
                    string.IsNullOrEmpty(keyword) ||
                    x.Code.Contains(keyword) ||
                    x.Name.Contains(keyword))
                .Select(x => x.Id);

            #region PartProcesses

            var partQuery = _dbContext.PartProcesses
                .AsNoTracking()
                .Where(x => machineIds.Contains(x.MachineId));

            if (plantFrom.HasValue)
                partQuery = partQuery.Where(x => x.PlantDate >= plantFrom.Value);

            if (plantTo.HasValue)
                partQuery = partQuery.Where(x => x.PlantDate <= plantTo.Value);

            var groupedPart = partQuery
                .GroupBy(x => x.MachineId)
                .Select(x => new MachineLatestSchedule
                {
                    MachineId = x.Key,
                    LatestPlantDate = x.Max(y => y.PlantDate)
                });


            #endregion

            #region MaintenanceProcesses

            var maintenanceQuery = _dbContext.MachineMaintenanceProcesses
                .AsNoTracking()
                .Where(x => machineIds.Contains(x.MachineId));

            if (plantFrom.HasValue)
                maintenanceQuery = maintenanceQuery.Where(x => x.PlantDate >= plantFrom.Value);

            if (plantTo.HasValue)
                maintenanceQuery = maintenanceQuery.Where(x => x.PlantDate <= plantTo.Value);

            var groupedMaintenance = maintenanceQuery
                .GroupBy(x => x.MachineId)
                .Select(x => new MachineLatestSchedule
                {
                    MachineId = x.Key,
                    LatestPlantDate = x.Max(y => y.PlantDate)
                });

            #endregion

            // Gộp 2 nguồn
            var groupedMachines = groupedPart
                .Concat(groupedMaintenance)
                .GroupBy(x => x.MachineId)
                .Select(x => new
                {
                    MachineId = x.Key,
                    LatestPlantDate = x.Max(y => y.LatestPlantDate)
                });

            var totalItems = await groupedMachines.CountAsync();

            var pagedMachineIds = await groupedMachines
                .OrderByDescending(x => x.LatestPlantDate)
                .ThenBy(x => x.MachineId)
                .Skip((currentPage - 1) * currentPageSize)
                .Take(currentPageSize)
                .Select(x => x.MachineId)
                .ToListAsync();

            var machines = await _dbContext.Machines
                .AsNoTracking()
                .Where(x => pagedMachineIds.Contains(x.Id))
                .ToListAsync();

            var partProcesses = await _dbContext.PartProcesses
                .AsNoTracking()
                .Where(x => pagedMachineIds.Contains(x.MachineId))
                .Include(x => x.Part)
                .ToListAsync();

            var maintenanceProcesses = await _dbContext.MachineMaintenanceProcesses
                .AsNoTracking()
                .Where(x => pagedMachineIds.Contains(x.MachineId))
                .ToListAsync();

            var partLookup = partProcesses
                .GroupBy(x => x.MachineId)
                .ToDictionary(x => x.Key, x => x.ToList());

            var maintenanceLookup = maintenanceProcesses
                .GroupBy(x => x.MachineId)
                .ToDictionary(x => x.Key, x => x.ToList());

            var result = new List<MachineScheduleResponse>();

            foreach (var machine in machines)
            {
                var response = _mapper.Map<MachineScheduleResponse>(machine);

                if (partLookup.TryGetValue(machine.Id, out var parts))
                {
                    response.Processes.AddRange(parts.Select(part => new MachineProcessResponse
                    {
                        Id = part.Id,
                        CreateAt = part.CreateAt,
                        CreateBy = part.CreateBy,
                        UpdateAt = part.UpdateAt,
                        UpdateBy = part.UpdateBy,
                        PlantDate = part.PlantDate,
                        StartTime = part.StartTime,
                        WorkingTime = part.WorkingTime,
                        Status = part.Status,
                        Note = part.Note,
                        PartId = part.PartId,
                        PartCode = part.Part?.Code ?? string.Empty,
                        Quantity = part.Part?.Quantity ?? 0,
                        Type = MachineProcessType.Manufacturing
                    }));
                }

                if (maintenanceLookup.TryGetValue(machine.Id, out var maintenances))
                {
                    response.Processes.AddRange(maintenances.Select(m => new MachineProcessResponse
                    {
                        Id = m.Id,
                        CreateAt = m.CreateAt,
                        CreateBy = m.CreateBy,
                        UpdateAt = m.UpdateAt,
                        UpdateBy = m.UpdateBy,
                        PlantDate = m.PlantDate,
                        StartTime = m.StartTime,
                        WorkingTime = m.WorkingTime,
                        Status = m.Status,
                        Note = m.Note ?? string.Empty,
                        PartCode = string.Empty,
                        Quantity = 0,
                        Type = MachineProcessType.Maintenance
                    }));
                }

                response.Processes = response.Processes
                    .OrderByDescending(x => x.PlantDate)
                    .ToList();

                result.Add(response);
            }

            return new SearchResponse<List<MachineScheduleResponse>>(
                currentPage,
                currentPageSize,
                totalItems,
                result);
        }
    }
}