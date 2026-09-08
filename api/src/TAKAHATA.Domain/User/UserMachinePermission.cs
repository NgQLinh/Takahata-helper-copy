namespace TAKAHATA.Domain.User
{
    public class UserMachinePermission
    {
        public Guid Guid { get; set; }
        public string UserId { get; set; }
        public int MachineId { get; set; }

        public UserMachinePermission(string userId, int machineId)
        {
            Guid = new Guid();
            UserId = userId;
            MachineId = machineId;
        }
    }
}
