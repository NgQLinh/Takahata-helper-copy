using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Equipment.Queries
{
    public class MachineScheduleQueryHandler : IRequestHandler<MachineScheduleQuery, ErrorOr<SearchResponse<List<MachineScheduleResponse>>>>
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMachineRepository _machineRepository;

        public MachineScheduleQueryHandler(
            IMachineRepository machineRepository,
            IMapper mapper,
            UserManager<ApplicationUser> userManager)
        {
            _machineRepository = machineRepository;
            _mapper = mapper;
            _userManager = userManager;
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

            response.Data.ForEach(item =>
            {
                var createdUser = users.FirstOrDefault(u => u.Id == item.CreateBy);
                if (createdUser != null)
                    item.CreateBy = createdUser.FullName;

                var updatedUser = users.FirstOrDefault(u => u.Id == item.UpdateBy);
                if (updatedUser != null)
                    item.UpdateBy = updatedUser.FullName;
            });

            return response;
        }
    }
}
