namespace TAKAHATA.Domain.MasterData
{
    public enum ProcessStatus
    {
        PendingApproval = -1,
        Planned = 0,
        InProgress = 1,
        Completed = 2,
        Cancelled = 3,
        Overdue = 4,
        Paused = 5,
    }
}
