using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record UpdatePartCommand(
        int Id,
        string IndexCode,
        string PartCode,
        int Quantity,
        bool Prioritize,
        PartType PartType,
        PartNewRepair? NewRepair,
        List<PartProcessRequest> PartProcesses) : IRequest<ErrorOr<PartResponse>>;
}
