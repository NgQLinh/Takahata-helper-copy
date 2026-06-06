using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Queries
{
    public class DeviceQueryHandler : IRequestHandler<DeviceQuery, ErrorOr<IEnumerable<Machine>>>
    {
        private readonly IDeviceRepository _deviceRepository;

        public DeviceQueryHandler(IDeviceRepository deviceRepository)
        {
            _deviceRepository = deviceRepository;
        }

        public async Task<ErrorOr<IEnumerable<Machine>>> Handle(DeviceQuery request, CancellationToken cancellationToken)
        {
            var result = await _deviceRepository.GetAsync();
            return result.ToList();
        }
    }
}
