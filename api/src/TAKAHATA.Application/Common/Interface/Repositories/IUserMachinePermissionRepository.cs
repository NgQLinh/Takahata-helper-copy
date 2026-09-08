using TAKAHATA.Domain.User;

namespace TAKAHATA.Application.Common.Interface.Repositories
{
    public interface IUserMachinePermissionRepository
    {
        Task<List<UserMachinePermission>> GetByUserIdAsync(string userId);
        Task<List<UserMachinePermission>> AddRangeAsync(string userId, List<UserMachinePermission> userMachinePermissions);
        Task DeleteRangeAsync(string id);
        Task<List<UserMachinePermission>> GetByUserIdsAsync(List<string> userIds);
    }
}
