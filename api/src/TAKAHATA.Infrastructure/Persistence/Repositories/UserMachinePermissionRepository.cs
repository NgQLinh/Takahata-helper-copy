using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class UserMachinePermissionRepository : IUserMachinePermissionRepository
    {
        private readonly AppDbContext _dbContext;

        public UserMachinePermissionRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<UserMachinePermission>> AddRangeAsync(string userId, List<UserMachinePermission> userMachinePermissions)
        {
            await _dbContext.UserMachinePermissions
                .Where(x => x.UserId == userId)
                .ExecuteDeleteAsync();

            await _dbContext.UserMachinePermissions.AddRangeAsync(userMachinePermissions);
            var effectedRows = await _dbContext.SaveChangesAsync();

            if (effectedRows > 0)
                return userMachinePermissions;
            else
                return [];
        }

        public async Task DeleteRangeAsync(string userId)
        {
            await _dbContext.UserMachinePermissions
                .Where(x => x.UserId == userId)
                .ExecuteDeleteAsync();
        }

        public async Task<List<UserMachinePermission>> GetByUserIdAsync(string userId)
        {
            return await _dbContext.UserMachinePermissions
                 .Where(x => x.UserId == userId)
                 .ToListAsync();
        }

        public async Task<List<UserMachinePermission>> GetByUserIdsAsync(List<string> userIds)
        {
            return await _dbContext.UserMachinePermissions
                .Where(x => userIds.Contains(x.UserId))
                .ToListAsync();
        }
    }
}
