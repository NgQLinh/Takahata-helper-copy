using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Domain.MachineOperation;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Domain.MoldManagement;
using TAKAHATA.Domain.User;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Infrastructure.Persistence
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Machine> Machines { get; set; }

        public DbSet<Operator> Operators => Set<Operator>();
        public DbSet<ProcessType> ProcessTypes => Set<ProcessType>();

        public DbSet<MoldProject> MoldProjects => Set<MoldProject>();
        public DbSet<MoldPart> MoldParts => Set<MoldPart>();

        public DbSet<WorkOrder> WorkOrders => Set<WorkOrder>();
        public DbSet<MachineSchedule> MachineSchedules => Set<MachineSchedule>();

        public DbSet<MachineOperationLog> MachineOperationLogs => Set<MachineOperationLog>();
        public DbSet<MachineDailySummary> MachineDailySummaries => Set<MachineDailySummary>();

        //public DbSet<CostCategory> CostCategories => Set<CostCategory>();
        //public DbSet<ProjectCost> ProjectCosts => Set<ProjectCost>();
        //public DbSet<ExcelImportBatch> ExcelImportBatches => Set<ExcelImportBatch>();
        //public DbSet<ExcelImportError> ExcelImportErrors => Set<ExcelImportError>();

        public AppDbContext(DbContextOptions<AppDbContext> options)
           : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            base.OnModelCreating(builder);
            // Customize the identity model if needed

            //builder.Entity<ProjectType>()
            //    .ToString();
        }
    }
}
