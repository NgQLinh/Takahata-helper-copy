using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260729002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WorkingTime",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.AlterColumn<double>(
                name: "WorkingTime",
                table: "PartProcesses",
                type: "double",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "WorkingTime",
                table: "PartProcesses",
                type: "double",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "WorkingTime",
                table: "MachineMaintenanceProcesses",
                type: "double",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
