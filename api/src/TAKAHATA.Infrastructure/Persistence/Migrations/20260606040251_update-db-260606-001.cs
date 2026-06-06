using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TAKAHATA.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatedb260606001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DEVICE_LOG");

            migrationBuilder.DropTable(
                name: "DEVICES");

            migrationBuilder.CreateTable(
                name: "CostCategories",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
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
                    table.PrimaryKey("PK_CostCategories", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ExcelImportBatches",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FileName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FileType = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImportedBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImportedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "longtext", nullable: true)
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
                    table.PrimaryKey("PK_ExcelImportBatches", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Machines",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Code = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<int>(type: "int", nullable: false),
                    SerialNumber = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Brand = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MachineStatus = table.Column<int>(type: "int", nullable: false),
                    BitAddress = table.Column<int>(type: "int", nullable: false),
                    StandardHoursPerDay = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreateBy = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UpdateBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Machines", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MoldProjects",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MoldCode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProjectType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Customer = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CompletedDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Status = table.Column<string>(type: "longtext", nullable: false)
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
                    table.PrimaryKey("PK_MoldProjects", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Operators",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OperatorCode = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FullName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Department = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreateBy = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UpdateBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Operators", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProcessTypes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
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
                    table.PrimaryKey("PK_ProcessTypes", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ExcelImportErrors",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BatchId = table.Column<long>(type: "bigint", nullable: false),
                    SheetName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RowNumber = table.Column<int>(type: "int", nullable: true),
                    ColumnName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ErrorMessage = table.Column<string>(type: "longtext", nullable: false)
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
                    table.PrimaryKey("PK_ExcelImportErrors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExcelImportErrors_ExcelImportBatches_BatchId",
                        column: x => x.BatchId,
                        principalTable: "ExcelImportBatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MachineDailySummaries",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MachineId = table.Column<long>(type: "bigint", nullable: false),
                    SummaryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    AutoHours = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ManualHours = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    SetupHours = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    AlarmHours = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    StopHours = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    TotalHours = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    UtilizationPercent = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    AutoPercent = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreateBy = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UpdateBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MachineDailySummaries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MachineDailySummaries_Machines_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MoldParts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProjectId = table.Column<long>(type: "bigint", nullable: false),
                    PartCode = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PartName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false)
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
                    table.PrimaryKey("PK_MoldParts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MoldParts_MoldProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "MoldProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "WorkOrders",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProjectId = table.Column<long>(type: "bigint", nullable: false),
                    PartId = table.Column<long>(type: "bigint", nullable: true),
                    ProcessTypeId = table.Column<long>(type: "bigint", nullable: false),
                    MachineId = table.Column<long>(type: "bigint", nullable: true),
                    WorkOrderCode = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PlanStart = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PlanEnd = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PlanHours = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    ActualStart = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ActualEnd = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ActualHours = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Note = table.Column<string>(type: "longtext", nullable: true)
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
                    table.PrimaryKey("PK_WorkOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkOrders_Machines_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machines",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_WorkOrders_MoldParts_PartId",
                        column: x => x.PartId,
                        principalTable: "MoldParts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_WorkOrders_MoldProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "MoldProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkOrders_ProcessTypes_ProcessTypeId",
                        column: x => x.ProcessTypeId,
                        principalTable: "ProcessTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MachineOperationLogs",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MachineId = table.Column<long>(type: "bigint", nullable: false),
                    WorkOrderId = table.Column<long>(type: "bigint", nullable: true),
                    OperatorId = table.Column<long>(type: "bigint", nullable: true),
                    LogTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    MachineStatus = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAuto = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsManual = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsSetup = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsAlarm = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsRunning = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreateBy = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UpdateBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MachineOperationLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MachineOperationLogs_Machines_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MachineOperationLogs_Operators_OperatorId",
                        column: x => x.OperatorId,
                        principalTable: "Operators",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MachineOperationLogs_WorkOrders_WorkOrderId",
                        column: x => x.WorkOrderId,
                        principalTable: "WorkOrders",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MachineSchedules",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MachineId = table.Column<long>(type: "bigint", nullable: false),
                    WorkOrderId = table.Column<long>(type: "bigint", nullable: true),
                    ScheduleDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ShiftCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EndTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PlannedHours = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Note = table.Column<string>(type: "longtext", nullable: true)
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
                    table.PrimaryKey("PK_MachineSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MachineSchedules_Machines_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MachineSchedules_WorkOrders_WorkOrderId",
                        column: x => x.WorkOrderId,
                        principalTable: "WorkOrders",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProjectCosts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProjectId = table.Column<long>(type: "bigint", nullable: false),
                    PartId = table.Column<long>(type: "bigint", nullable: true),
                    WorkOrderId = table.Column<long>(type: "bigint", nullable: true),
                    CostCategoryId = table.Column<long>(type: "bigint", nullable: false),
                    CostAmount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    CostDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Note = table.Column<string>(type: "longtext", nullable: true)
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
                    table.PrimaryKey("PK_ProjectCosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectCosts_CostCategories_CostCategoryId",
                        column: x => x.CostCategoryId,
                        principalTable: "CostCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectCosts_MoldParts_PartId",
                        column: x => x.PartId,
                        principalTable: "MoldParts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProjectCosts_MoldProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "MoldProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectCosts_WorkOrders_WorkOrderId",
                        column: x => x.WorkOrderId,
                        principalTable: "WorkOrders",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_CostCategories_Code",
                table: "CostCategories",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExcelImportErrors_BatchId",
                table: "ExcelImportErrors",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_MachineDailySummaries_MachineId_SummaryDate",
                table: "MachineDailySummaries",
                columns: new[] { "MachineId", "SummaryDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MachineOperationLogs_MachineId_LogTime",
                table: "MachineOperationLogs",
                columns: new[] { "MachineId", "LogTime" });

            migrationBuilder.CreateIndex(
                name: "IX_MachineOperationLogs_OperatorId",
                table: "MachineOperationLogs",
                column: "OperatorId");

            migrationBuilder.CreateIndex(
                name: "IX_MachineOperationLogs_WorkOrderId",
                table: "MachineOperationLogs",
                column: "WorkOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_MachineSchedules_MachineId_ScheduleDate",
                table: "MachineSchedules",
                columns: new[] { "MachineId", "ScheduleDate" });

            migrationBuilder.CreateIndex(
                name: "IX_MachineSchedules_WorkOrderId",
                table: "MachineSchedules",
                column: "WorkOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_MoldParts_ProjectId_PartCode",
                table: "MoldParts",
                columns: new[] { "ProjectId", "PartCode" });

            migrationBuilder.CreateIndex(
                name: "IX_Operators_OperatorCode",
                table: "Operators",
                column: "OperatorCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProcessTypes_Code",
                table: "ProcessTypes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCosts_CostCategoryId",
                table: "ProjectCosts",
                column: "CostCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCosts_PartId",
                table: "ProjectCosts",
                column: "PartId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCosts_ProjectId",
                table: "ProjectCosts",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCosts_WorkOrderId",
                table: "ProjectCosts",
                column: "WorkOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_MachineId",
                table: "WorkOrders",
                column: "MachineId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_PartId",
                table: "WorkOrders",
                column: "PartId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_ProcessTypeId",
                table: "WorkOrders",
                column: "ProcessTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_ProjectId",
                table: "WorkOrders",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_WorkOrderCode",
                table: "WorkOrders",
                column: "WorkOrderCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExcelImportErrors");

            migrationBuilder.DropTable(
                name: "MachineDailySummaries");

            migrationBuilder.DropTable(
                name: "MachineOperationLogs");

            migrationBuilder.DropTable(
                name: "MachineSchedules");

            migrationBuilder.DropTable(
                name: "ProjectCosts");

            migrationBuilder.DropTable(
                name: "ExcelImportBatches");

            migrationBuilder.DropTable(
                name: "Operators");

            migrationBuilder.DropTable(
                name: "CostCategories");

            migrationBuilder.DropTable(
                name: "WorkOrders");

            migrationBuilder.DropTable(
                name: "Machines");

            migrationBuilder.DropTable(
                name: "MoldParts");

            migrationBuilder.DropTable(
                name: "ProcessTypes");

            migrationBuilder.DropTable(
                name: "MoldProjects");

            migrationBuilder.CreateTable(
                name: "DEVICE_LOG",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    EquipmentId = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReadAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DEVICE_LOG", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DEVICES",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BitAddress = table.Column<int>(type: "int", nullable: false),
                    Brand = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreateBy = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SerialNumber = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    UpdateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UpdateBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DEVICES", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
