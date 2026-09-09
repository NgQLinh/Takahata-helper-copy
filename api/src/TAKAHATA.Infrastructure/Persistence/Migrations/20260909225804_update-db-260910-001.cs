using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260910001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "P_Part_Code",
                table: "Parts",
                newName: "IX_Parts_Code");

            migrationBuilder.AddColumn<bool>(
                name: "IsAutomatic",
                table: "Machines",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAutomatic",
                table: "Machines");

            migrationBuilder.RenameIndex(
                name: "IX_Parts_Code",
                table: "Parts",
                newName: "P_Part_Code");
        }
    }
}
