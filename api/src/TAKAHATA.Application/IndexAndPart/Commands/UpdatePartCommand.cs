using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record UpdatePartCommand(long Id, string IndexCode, string PartCode, List<PartProcessRequest> PartProcesses) : IRequest<ErrorOr<PartResponse>>;
}
