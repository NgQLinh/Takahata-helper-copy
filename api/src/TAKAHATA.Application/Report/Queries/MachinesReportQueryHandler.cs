using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Report;

namespace TAKAHATA.Application.Report.Queries
{
    public class MachinesReportQueryHandler : IRequestHandler<MachinesReportQuery, ErrorOr<MachineReportResponse>>
    {
        private readonly IMachineRepository _machineLogRepository;

        public MachinesReportQueryHandler(IMachineRepository machineLogRepository)
        {
            _machineLogRepository = machineLogRepository;
        }

        public async Task<ErrorOr<MachineReportResponse>> Handle(
            MachinesReportQuery request,
            CancellationToken cancellationToken)
        {
            var machineKpis = await _machineLogRepository.SearchKPIAsync(request.From, request.To);

            var response = new MachineReportResponse
            {
                MachineKPIs = machineKpis
            };

            return response;
        }
    }
}
