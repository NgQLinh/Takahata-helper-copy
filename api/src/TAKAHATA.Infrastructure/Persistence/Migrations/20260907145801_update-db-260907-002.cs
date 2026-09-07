using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260907002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PartType",
                table: "Parts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "AssemblyTime",
                table: "PartProcesses",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EstimatedTime",
                table: "PartProcesses",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MeasurementTime",
                table: "PartProcesses",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EstimatedTime",
                table: "MachineMaintenanceProcesses",
                type: "double",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PartType",
                table: "Parts");

            migrationBuilder.DropColumn(
                name: "AssemblyTime",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "EstimatedTime",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "MeasurementTime",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "EstimatedTime",
                table: "MachineMaintenanceProcesses");
        }
    }
}
