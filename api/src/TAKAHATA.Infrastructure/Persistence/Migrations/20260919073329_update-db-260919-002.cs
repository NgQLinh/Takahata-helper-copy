using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260919002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReferenceId",
                table: "PartProcesses");

            migrationBuilder.AddColumn<bool>(
                name: "IsOverdue",
                table: "PartProcesses",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOverdue",
                table: "PartProcesses");

            migrationBuilder.AddColumn<int>(
                name: "ReferenceId",
                table: "PartProcesses",
                type: "int",
                nullable: true);
        }
    }
}
