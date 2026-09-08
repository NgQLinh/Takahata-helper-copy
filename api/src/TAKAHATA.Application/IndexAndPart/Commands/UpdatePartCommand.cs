using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record UpdatePartCommand(
        int Id,
        string IndexCode,
        string PartCode,
        int Quantity,
        bool Prioritize,
        List<PartProcessRequest> PartProcesses) : IRequest<ErrorOr<PartResponse>>;
}
