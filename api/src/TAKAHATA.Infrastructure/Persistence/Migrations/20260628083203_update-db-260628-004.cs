using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260628004 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Partes_Indexes_IndexId",
                table: "Partes");

            migrationBuilder.DropForeignKey(
                name: "FK_PartProcesses_Partes_PartId",
                table: "PartProcesses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Partes",
                table: "Partes");

            migrationBuilder.RenameTable(
                name: "Partes",
                newName: "Parts");

            migrationBuilder.RenameIndex(
                name: "IX_Partes_IndexId",
                table: "Parts",
                newName: "IX_Parts_IndexId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Parts",
                table: "Parts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PartProcesses_Parts_PartId",
                table: "PartProcesses",
                column: "PartId",
                principalTable: "Parts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Parts_Indexes_IndexId",
                table: "Parts",
                column: "IndexId",
                principalTable: "Indexes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PartProcesses_Parts_PartId",
                table: "PartProcesses");

            migrationBuilder.DropForeignKey(
                name: "FK_Parts_Indexes_IndexId",
                table: "Parts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Parts",
                table: "Parts");

            migrationBuilder.RenameTable(
                name: "Parts",
                newName: "Partes");

            migrationBuilder.RenameIndex(
                name: "IX_Parts_IndexId",
                table: "Partes",
                newName: "IX_Partes_IndexId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Partes",
                table: "Partes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Partes_Indexes_IndexId",
                table: "Partes",
                column: "IndexId",
                principalTable: "Indexes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PartProcesses_Partes_PartId",
                table: "PartProcesses",
                column: "PartId",
                principalTable: "Partes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
