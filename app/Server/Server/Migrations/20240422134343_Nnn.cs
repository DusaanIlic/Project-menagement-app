using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Nnn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "TaskCategories",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ProjectTaskCategories",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    TaskCategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTaskCategories", x => new { x.ProjectId, x.TaskCategoryId });
                    table.ForeignKey(
                        name: "FK_ProjectTaskCategories_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectTaskCategories_TaskCategories_TaskCategoryId",
                        column: x => x.TaskCategoryId,
                        principalTable: "TaskCategories",
                        principalColumn: "TaskCategoryID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 15, 43, 42, 69, DateTimeKind.Local).AddTicks(1221), "$2a$10$QVo4Bo2Xct40Hud7Wg/1M.6PZBXXoWqKNwGuH6kewBiSjeXH2iBLG" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 15, 43, 42, 223, DateTimeKind.Local).AddTicks(1027), "$2a$10$m7ybYhVB/O8XR3N04YO8U.7zT56GCA0K1MpX6JjIbaOcgcDWYimVK" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 15, 43, 42, 379, DateTimeKind.Local).AddTicks(6732), "$2a$10$pFrByBa/OybsTlcJfh617OZ2sooz5XZJ4r4jYOS9ntkgUuPpwaOsy" });

            migrationBuilder.InsertData(
                table: "ProjectPermissions",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 21, "Change task category" },
                    { 22, "Remove task category" },
                    { 23, "Add task status" },
                    { 24, "Remove task status" }
                });

            migrationBuilder.UpdateData(
                table: "TaskCategories",
                keyColumn: "TaskCategoryID",
                keyValue: 1,
                column: "IsDefault",
                value: true);

            migrationBuilder.InsertData(
                table: "ProjectRolePermissions",
                columns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                values: new object[,]
                {
                    { 21, 1 },
                    { 22, 1 },
                    { 23, 1 },
                    { 24, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTaskCategories_TaskCategoryId",
                table: "ProjectTaskCategories",
                column: "TaskCategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectTaskCategories");

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 21, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 22, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 23, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 24, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "TaskCategories");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 21, 21, 7, 42, 975, DateTimeKind.Local).AddTicks(5554), "$2a$10$2uv8/UNh9qfJqekXjVp6P.nleL052aHOQDIx93.bSb/EMCPOWEquC" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 21, 21, 7, 43, 62, DateTimeKind.Local).AddTicks(669), "$2a$10$/wvLIdmicmFcsOw5wrjk7eDhjXRTPTCe2puRWyEXtVpgyYnJ.aaw6" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 21, 21, 7, 43, 148, DateTimeKind.Local).AddTicks(3668), "$2a$10$psHQaT3p1hFtq6H20MfJJOHQoOBPGD18DVvC.BNfdwUNuV0tAqphG" });
        }
    }
}
