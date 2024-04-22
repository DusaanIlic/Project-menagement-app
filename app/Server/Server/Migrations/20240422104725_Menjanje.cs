using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Menjanje : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_TaskCategories_TaskCategoryId",
                table: "ProjectTasks");

            migrationBuilder.RenameColumn(
                name: "TaskCategoryId",
                table: "ProjectTasks",
                newName: "TaskCategoryID");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTasks_TaskCategoryId",
                table: "ProjectTasks",
                newName: "IX_ProjectTasks_TaskCategoryID");

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "TaskCategories",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "TaskCategoryID",
                table: "ProjectTasks",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

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
                values: new object[] { new DateTime(2024, 4, 22, 12, 47, 23, 612, DateTimeKind.Local).AddTicks(3405), "$2a$10$XpxLKtYqXJe8zaRZpBDQzO/dkbmlU310jysv1/gi0KS/Oduptr3Ue" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 12, 47, 23, 762, DateTimeKind.Local).AddTicks(4847), "$2a$10$gbW.rJ1zNf0Gj6FMoohYWedcNw/Y4EpX0R3//O4ANHSC21DlWu5wu" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 12, 47, 23, 911, DateTimeKind.Local).AddTicks(8600), "$2a$10$U3o3p48L0926xn8O6wWrD.sWRVxxHig.z8rEK1QT0gR6Fjv0O3fBq" });

            migrationBuilder.UpdateData(
                table: "TaskCategories",
                keyColumn: "TaskCategoryID",
                keyValue: 1,
                column: "IsDefault",
                value: false);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTaskCategories_TaskCategoryId",
                table: "ProjectTaskCategories",
                column: "TaskCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_TaskCategories_TaskCategoryID",
                table: "ProjectTasks",
                column: "TaskCategoryID",
                principalTable: "TaskCategories",
                principalColumn: "TaskCategoryID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_TaskCategories_TaskCategoryID",
                table: "ProjectTasks");

            migrationBuilder.DropTable(
                name: "ProjectTaskCategories");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "TaskCategories");

            migrationBuilder.RenameColumn(
                name: "TaskCategoryID",
                table: "ProjectTasks",
                newName: "TaskCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTasks_TaskCategoryID",
                table: "ProjectTasks",
                newName: "IX_ProjectTasks_TaskCategoryId");

            migrationBuilder.AlterColumn<int>(
                name: "TaskCategoryId",
                table: "ProjectTasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_TaskCategories_TaskCategoryId",
                table: "ProjectTasks",
                column: "TaskCategoryId",
                principalTable: "TaskCategories",
                principalColumn: "TaskCategoryID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
