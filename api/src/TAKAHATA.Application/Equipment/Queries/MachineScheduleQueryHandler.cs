using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Equipment.Queries
{
    public class MachineScheduleQueryHandler : IRequestHandler<MachineScheduleQuery, ErrorOr<SearchResponse<List<MachineScheduleResponse>>>>
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMachineRepository _machineRepository;

        private readonly IPartProcessRepository _partProcessRepository;

        public MachineScheduleQueryHandler(
            IMachineRepository machineRepository,
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            IPartProcessRepository partProcessRepository)
        {
            _machineRepository = machineRepository;
            _mapper = mapper;
            _userManager = userManager;
            _partProcessRepository = partProcessRepository;
        }

        public async Task<ErrorOr<SearchResponse<List<MachineScheduleResponse>>>> Handle(
            MachineScheduleQuery request,
            CancellationToken cancellationToken)
        {
            var response = await _machineRepository.SearchSchedule(
                request.Keyword,
                request.PlantFrom,
                request.PlantTo,
                request.Page,
                request.PageSize);

            var users = _userManager.Users.ToList();

            var processIds = new HashSet<int>();

            foreach (var data in response.Data)
            {
                foreach (var process in data.Processes)
                {
                    if (process.ReferenceId.HasValue)
                        processIds.Add(process.ReferenceId.Value);
                }
            }

            var relatedProcesses = new List<PartProcess>();

            if (processIds != null && processIds.Count != 0)
                relatedProcesses = await _partProcessRepository.GetRelatedProcessesAsync(processIds);

            response.Data.ForEach(item =>
            {
                var createdUser = users.FirstOrDefault(u => u.Id == item.CreateBy);
                if (createdUser != null)
                    item.CreateBy = createdUser.FullName;

                var updatedUser = users.FirstOrDefault(u => u.Id == item.UpdateBy);
                if (updatedUser != null)
                    item.UpdateBy = updatedUser.FullName;

                foreach (var process in item.Processes)
                {
                    if (process.ReferenceId.HasValue && relatedProcesses != null && relatedProcesses.Count != 0)
                    {
                        process.DonePreviouslyQuantity = relatedProcesses
                            .Where(pp => pp.Id != process.Id && pp.PlantDate < process.PlantDate)
                            .Where(pp => pp.Id == process.ReferenceId || (pp.ReferenceId.HasValue && pp.ReferenceId == process.ReferenceId))
                            .Sum(pp => pp.ProcessedQuantity);
                    }
                }
            });

            return response;
        }
    }
}

