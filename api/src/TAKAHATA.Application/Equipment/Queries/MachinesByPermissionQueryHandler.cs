using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Equipment.Queries
{
    public class MachinesByPermissionQueryHandler : IRequestHandler<MachinesByPermissionQuery, ErrorOr<IEnumerable<MachineResponse>>>
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMachineRepository _machineRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUserMachinePermissionRepository _userMachinePermissionRepository;

        public MachinesByPermissionQueryHandler(
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            IMachineRepository machineRepository,
            ICurrentUserService currentUserService,
            IUserMachinePermissionRepository userMachinePermissionRepository)
        {
            _mapper = mapper;
            _userManager = userManager;
            _machineRepository = machineRepository;
            _currentUserService = currentUserService;
            _userMachinePermissionRepository = userMachinePermissionRepository;
        }

        public async Task<ErrorOr<IEnumerable<MachineResponse>>> Handle(MachinesByPermissionQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;

            var userMachinePermissions = await _userMachinePermissionRepository.GetByUserIdAsync(userId);
            var machineIds = userMachinePermissions.Select(p => p.MachineId).ToList();

            var machines = await _machineRepository.GetByIdsAsync(machineIds);

            var users = _userManager.Users.ToList();

            var response = machines
                .Select((r, index) =>
                {
                    var item = _mapper.Map<MachineResponse>(r);
                    item.SequenceNumber = index + 1;

                    var createdUser = users.FirstOrDefault(u => u.Id == item.CreateBy);
                    if (createdUser != null)
                        item.CreateBy = createdUser.FullName;

                    var updatedUser = users.FirstOrDefault(u => u.Id == item.UpdateBy);
                    if (updatedUser != null)
                        item.UpdateBy = updatedUser.FullName;

                    return item;
                })
                .OrderBy(res => res.SequenceNumber)
                .ToList();

            return response;
        }
    }
}
