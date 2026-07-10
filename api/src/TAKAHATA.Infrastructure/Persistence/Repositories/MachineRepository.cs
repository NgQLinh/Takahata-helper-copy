using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class MachineRepository : BaseRepository<Machine>, IMachineRepository
    {

        public MachineRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<bool> IsExistedAsync(string name, string code)
        {
            var machine = await _dbContext.Machines
                .FirstOrDefaultAsync(m => m.Name == name || m.Code == code);
            return machine != null;
        }

        public async Task<bool> IsExistedExceptIdAsync(string name, string code, long id)
        {
            var machine = await _dbContext.Machines
                .FirstOrDefaultAsync(m => (m.Name == name || m.Code == code) && m.Id != id);
            return machine != null;
        }

        public async Task<IEnumerable<Machine>> GetAsync()
        {
            return await _dbContext.Machines
                .Include(m => m.PartProcesses)
                .ToListAsync();
        }
    }
}
