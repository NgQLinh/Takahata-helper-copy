using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public class MachineMaintenanceProcessQueryHandler : IRequestHandler<MachineMaintenanceProcessQuery, ErrorOr<MachineMaintenanceProcessResponse>>
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

        public async Task<ErrorOr<MachineMaintenanceProcessResponse>> Handle(
            MachineMaintenanceProcessQuery request,
            CancellationToken cancellationToken)
        {
            var users = _userManager.Users.ToList();

            var maintenanceProcess = await _machineMaintenanceProcessRepository.GetByIdAsync(request.Id);

            if (maintenanceProcess == null)
                return Errors.MachineMaintenanceProcess.NotFound;

            var response = _mapper.Map<MachineMaintenanceProcessResponse>(maintenanceProcess);

            var createdUser = users.FirstOrDefault(u => u.Id == response.CreateBy);
            if (createdUser != null)
                response.CreateBy = createdUser.FullName;

            var updatedUser = users.FirstOrDefault(u => u.Id == response.UpdateBy);
            if (updatedUser != null)
                response.UpdateBy = updatedUser.FullName;

            return response;
        }
    }
}
