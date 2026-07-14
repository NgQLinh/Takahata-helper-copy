using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260714004 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProcessedQuantity",
                table: "Parts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProcessedQuantity",
                table: "Parts");
        }
    }
}
