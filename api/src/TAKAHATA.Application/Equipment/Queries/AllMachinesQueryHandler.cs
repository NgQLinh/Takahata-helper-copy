using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Equipment.Queries
{
    public class AllMachinesQueryHandler : IRequestHandler<AllMachinesQuery, ErrorOr<IEnumerable<MachineResponse>>>
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMachineRepository _machineRepository;

        public AllMachinesQueryHandler(
            IMachineRepository machineRepository,
            IMapper mapper,
            UserManager<ApplicationUser> userManager)
        {
            _machineRepository = machineRepository;
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<ErrorOr<IEnumerable<MachineResponse>>> Handle(
            AllMachinesQuery request,
            CancellationToken cancellationToken)
        {
            var result = await _machineRepository.GetAsync();

            var users = _userManager.Users.ToList();

            var response = result
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
