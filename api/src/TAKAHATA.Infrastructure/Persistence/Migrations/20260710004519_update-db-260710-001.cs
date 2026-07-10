using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260710001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "PS_MachineMaintenanceProcess_MachineId",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.CreateIndex(
                name: "IX_MachineMaintenanceProcess_MachineId_PlanDate_Id",
                table: "MachineMaintenanceProcesses",
                columns: new[] { "MachineId", "PlanDate", "Id" },
                descending: new[] { false, true, false });

            migrationBuilder.CreateIndex(
                name: "IX_MachineMaintenanceProcess_MachineId_Status_PlanDate_Id",
                table: "MachineMaintenanceProcesses",
                columns: new[] { "MachineId", "Status", "PlanDate", "Id" },
                descending: new[] { false, false, true, false });

            migrationBuilder.CreateIndex(
                name: "IX_MachineMaintenanceProcess_PlanDate_Id",
                table: "MachineMaintenanceProcesses",
                columns: new[] { "PlanDate", "Id" },
                descending: new[] { true, false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MachineMaintenanceProcess_MachineId_PlanDate_Id",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.DropIndex(
                name: "IX_MachineMaintenanceProcess_MachineId_Status_PlanDate_Id",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.DropIndex(
                name: "IX_MachineMaintenanceProcess_PlanDate_Id",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.CreateIndex(
                name: "PS_MachineMaintenanceProcess_MachineId",
                table: "MachineMaintenanceProcesses",
                column: "MachineId");
        }
    }
}
