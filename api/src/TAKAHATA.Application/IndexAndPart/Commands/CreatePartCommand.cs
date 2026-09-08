using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record CreatePartCommand(
        string IndexCode,
        string PartCode,
        int Quantity,
        bool Prioritize,
        ProcessStatus Status,
        PartType PartType,
        List<PartProcessRequest> PartProcesses) : IRequest<ErrorOr<PartResponse>>;
}
