using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class CompleteCommandHandler : IRequestHandler<CompleteCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        public CompleteCommandHandler()
        {
            
        }

        public Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            CompleteCommand request,
            CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
