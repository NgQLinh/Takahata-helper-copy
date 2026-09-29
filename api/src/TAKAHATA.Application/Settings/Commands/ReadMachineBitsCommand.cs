using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Settings;

namespace TAKAHATA.Application.Settings.Commands
{
    public record ReadMachineBitsCommand(
        int StatusBitAddress,
        int PartBitAddress,
        int PartProcessBitAddress,
        int ProcessStatusBitAddress) : IRequest<ErrorOr<ReadMachineBitsResponse>>;
}
