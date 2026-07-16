using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class PauseCommandHandler : IRequestHandler<PauseCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        public PauseCommandHandler()
        {
            
        }

        public Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            PauseCommand request,
            CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
