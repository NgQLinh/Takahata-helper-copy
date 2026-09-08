using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260908002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "P_Part_Code",
                table: "Parts");

            migrationBuilder.CreateIndex(
                name: "P_Part_Code",
                table: "Parts",
                column: "Code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "P_Part_Code",
                table: "Parts");

            migrationBuilder.CreateIndex(
                name: "P_Part_Code",
                table: "Parts",
                column: "Code",
                unique: true);
        }
    }
}
