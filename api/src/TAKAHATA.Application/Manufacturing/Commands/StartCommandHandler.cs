using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class StartCommandHandler : IRequestHandler<StartCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        public StartCommandHandler()
        {
            
        }

        public Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            StartCommand request,
            CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
