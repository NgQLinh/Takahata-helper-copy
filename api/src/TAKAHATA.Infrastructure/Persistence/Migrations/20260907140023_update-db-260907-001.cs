using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260907001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Prioritize",
                table: "Parts",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<double>(
                name: "ProgrammingTime",
                table: "PartProcesses",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkerNote",
                table: "PartProcesses",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "MachineType",
                table: "Machines",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Prioritize",
                table: "Parts");

            migrationBuilder.DropColumn(
                name: "ProgrammingTime",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "WorkerNote",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "MachineType",
                table: "Machines");
        }
    }
}
