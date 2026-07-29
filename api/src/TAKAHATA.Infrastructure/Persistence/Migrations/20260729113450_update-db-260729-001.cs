using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260729001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActualDate",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "ActualDate",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.AlterColumn<double>(
                name: "WorkingTime",
                table: "PartProcesses",
                type: "double",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "PartProcesses",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "PartProcesses",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PerformedBy",
                table: "PartProcesses",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "StartTime",
                table: "PartProcesses",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "PlantDate",
                table: "MachineMaintenanceProcesses",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "MachineMaintenanceProcesses",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartTime",
                table: "MachineMaintenanceProcesses",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "PerformedBy",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "PartProcesses");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "MachineMaintenanceProcesses");

            migrationBuilder.AlterColumn<double>(
                name: "WorkingTime",
                table: "PartProcesses",
                type: "double",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.UpdateData(
                table: "PartProcesses",
                keyColumn: "Note",
                keyValue: null,
                column: "Note",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "PartProcesses",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "ActualDate",
                table: "PartProcesses",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "PlantDate",
                table: "MachineMaintenanceProcesses",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "ActualDate",
                table: "MachineMaintenanceProcesses",
                type: "date",
                nullable: true);
        }
    }
}
