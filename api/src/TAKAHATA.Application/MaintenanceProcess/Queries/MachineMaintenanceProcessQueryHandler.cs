using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.MaintenanceProcess;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public class MachineMaintenanceProcessQueryHandler : IRequestHandler<MachineMaintenanceProcessQuery, ErrorOr<SearchResponse<MachineMaintenanceProcess>>>
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMachineMaintenanceProcessRepository _machineMaintenanceProcessRepository;

        public MachineMaintenanceProcessQueryHandler(
            IMapper mapper,
            IMachineMaintenanceProcessRepository machineMaintenanceProcessRepository,
            UserManager<ApplicationUser> userManager)
        {
            _mapper = mapper;
            _machineMaintenanceProcessRepository = machineMaintenanceProcessRepository;
            _userManager = userManager;
        }

        public async Task<ErrorOr<SearchResponse<MachineMaintenanceProcess>>> Handle(MachineMaintenanceProcessQuery request, CancellationToken cancellationToken)
        {
            var users = _userManager.Users.ToList();

            var response = await _machineMaintenanceProcessRepository.SearchAsync(
                 request.MachineIds,
                 request.Statuses,
                 request.From,
                 request.To,
                 request.Page,
                 request.PageSize);

            foreach (var item in response.Values)
            {
                var createdUser = users.FirstOrDefault(u => u.Id == item.CreateBy);
                if (createdUser != null)
                    item.CreateBy = createdUser.FullName;

                var updatedUser = users.FirstOrDefault(u => u.Id == item.UpdateBy);
                if (updatedUser != null)
                    item.UpdateBy = updatedUser.FullName;
            }

            return response;
        }
    }
}
