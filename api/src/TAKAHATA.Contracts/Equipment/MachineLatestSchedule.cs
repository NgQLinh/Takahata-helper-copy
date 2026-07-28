namespace TAKAHATA.Contracts.Equipment
{
    public class MachineLatestSchedule
    {
        public long MachineId { get; set; }
        public DateOnly? LatestPlantDate { get; set; }
    }

}
