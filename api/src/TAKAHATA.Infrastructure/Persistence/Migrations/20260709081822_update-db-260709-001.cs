using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260709001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "P_Index_Code",
                table: "Parts",
                newName: "P_Part_Code");

            migrationBuilder.RenameIndex(
                name: "PS_Index_PartId",
                table: "PartProcesses",
                newName: "PS_PartProcess_PartId");

            migrationBuilder.RenameIndex(
                name: "PS_Index_MachineId",
                table: "PartProcesses",
                newName: "PS_PartProcess_MachineId");

            migrationBuilder.CreateTable(
                name: "MachineMaintenanceProcesses",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MachineId = table.Column<long>(type: "bigint", nullable: false),
                    MaintenanceType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PlanDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ActualDate = table.Column<DateOnly>(type: "date", nullable: true),
                    WorkingHours = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    PerformedBy = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsCompleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Note = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreateBy = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UpdateBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MachineMaintenanceProcesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MachineMaintenanceProcesses_Machines_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "PS_MachineMaintenanceProcess_MachineId",
                table: "MachineMaintenanceProcesses",
                column: "MachineId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MachineMaintenanceProcesses");

            migrationBuilder.RenameIndex(
                name: "P_Part_Code",
                table: "Parts",
                newName: "P_Index_Code");

            migrationBuilder.RenameIndex(
                name: "PS_PartProcess_PartId",
                table: "PartProcesses",
                newName: "PS_Index_PartId");

            migrationBuilder.RenameIndex(
                name: "PS_PartProcess_MachineId",
                table: "PartProcesses",
                newName: "PS_Index_MachineId");
        }
    }
}
