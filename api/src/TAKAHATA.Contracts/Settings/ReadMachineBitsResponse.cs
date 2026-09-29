namespace TAKAHATA.Contracts.Settings
{
    public record ReadMachineBitsResponse(
        int StatusValue,
        int PartValue,
        int PartProcessValue,
        int ProcessStatusValue);
}

