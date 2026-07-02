using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record CreatePartCommand(string IndexCode, string PartCode, List<PartProcessRequest> PartProcesses) : IRequest<ErrorOr<PartResponse>>;
}
