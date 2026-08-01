namespace TAKAHATA.Contracts.Equipment
{
    public class MachineLatestSchedule
    {
        public int MachineId { get; set; }
        public DateOnly? LatestPlantDate { get; set; }
    }

}
