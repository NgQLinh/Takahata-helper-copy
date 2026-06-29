using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class MachineRepository : IMachineRepository
    {
        private readonly AppDbContext _dbContext;

        public MachineRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
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

        public async Task<Machine?> AddAsync(Machine machine)
        {
            await _dbContext.Machines.AddAsync(machine);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? machine : null;
        }

        public async Task<IEnumerable<Machine>> GetAsync()
        {
            return await _dbContext.Machines
                .Include(m => m.PartProcesses)
                .ToListAsync();
        }

        public async Task<Machine?> GetByIdAsync(long id)
        {
            return await _dbContext.Machines.FindAsync(id);
        }

        public async Task<Machine?> DeleteMachineByIdAsync(long id)
        {
            var machine = await _dbContext.Machines.FindAsync(id);
            if (machine == null)
                return null;

            _dbContext.Machines.Remove(machine);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? machine : null;
        }

        public async Task<Machine?> UpdateAsync(Machine machine)
        {
            _dbContext.Machines.Update(machine);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? machine : null;
        }
    }
}
