using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Report;

namespace TAKAHATA.Application.Report.Queries
{
    public class PartProcessReportQueryHandler : IRequestHandler<PartProcessReportQuery, ErrorOr<PartProcessReportResponse>>
    {
        private readonly IPartProcessRepository _partProcessRepository;

        public PartProcessReportQueryHandler(IPartProcessRepository partProcessRepository)
        {
            _partProcessRepository = partProcessRepository;
        }

        public async Task<ErrorOr<PartProcessReportResponse>> Handle(
            PartProcessReportQuery request,
            CancellationToken cancellationToken)
        {
            var partProcessKPIs = await _partProcessRepository.SearchKPIAsync(request.From, request.To);

            var response = new PartProcessReportResponse
            {
                PartProcessKPIs = partProcessKPIs,
            };

            return response;
        }
    }
}
