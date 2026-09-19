using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260919001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProcessedQuantity",
                table: "Parts");

            migrationBuilder.AddColumn<int>(
                name: "ReferenceId",
                table: "PartProcesses",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReferenceId",
                table: "PartProcesses");

            migrationBuilder.AddColumn<int>(
                name: "ProcessedQuantity",
                table: "Parts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
