using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.Settings
{
    public record ReadMachineBitsResponse(
        int StatusValue,
        int PartValue,
        int PartProcessValue);
}

