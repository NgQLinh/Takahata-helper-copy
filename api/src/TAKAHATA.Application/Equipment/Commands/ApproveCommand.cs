using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record ApproveCommand(int Id) : IRequest<ErrorOr<PartResponse>>;
}
