using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public record PauseCommand(long Id) : IRequest<ErrorOr<ManufacturingProcessResponse>>;
}
