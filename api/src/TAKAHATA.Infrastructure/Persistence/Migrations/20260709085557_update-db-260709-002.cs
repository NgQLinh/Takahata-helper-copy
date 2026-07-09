using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260709002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "PartProcesses");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "PartProcesses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "MachineMaintenanceProcesses",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "PartProcesses",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
