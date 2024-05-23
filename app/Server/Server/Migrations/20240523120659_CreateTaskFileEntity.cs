using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateTaskFileEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TaskFile",
                columns: table => new
                {
                    TaskId = table.Column<int>(type: "INTEGER", nullable: false),
                    FileId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskFile", x => new { x.TaskId, x.FileId });
                    table.ForeignKey(
                        name: "FK_TaskFile_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "FileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaskFile_ProjectTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "ProjectTasks",
                        principalColumn: "TaskId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 23, 14, 6, 58, 104, DateTimeKind.Local).AddTicks(6131), "$2a$10$ibgLE9Ezwreuta8NTh2Q.OetU4ZVxi/ounefHvx/xcRgA8nIjTe7." });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 23, 14, 6, 58, 204, DateTimeKind.Local).AddTicks(9098), "$2a$10$Gq/8XRoifnmSRDv2fNHyi.nIv.DAzGrhL2r1WjCb/2FXdTN5yhFbe" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 23, 14, 6, 58, 303, DateTimeKind.Local).AddTicks(9754), "$2a$10$Sl84Cb9NmKDrLAtYeO50t./QBz82L327sXtMDVXY6LC/K2FLrBeZq" });

            migrationBuilder.CreateIndex(
                name: "IX_TaskFile_FileId",
                table: "TaskFile",
                column: "FileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaskFile");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 20, 18, 57, 28, 40, DateTimeKind.Local).AddTicks(6094), "$2a$10$aDKZ3hffQo5omEdyYyr6M.LrIPD7WzxpquSlAI.I6qx7UEBTYbhMq" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 20, 18, 57, 28, 205, DateTimeKind.Local).AddTicks(5861), "$2a$10$7tFnCrpO7Z1ogPlHbWVty.95AdJMGLjfTQ5t3a6eOMvEAlcs9F5KG" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 20, 18, 57, 28, 393, DateTimeKind.Local).AddTicks(1963), "$2a$10$z5CCbi/FNDcqYFo6kVz8lejbc4nrEbPZsh9.y2v59/seCQ2BnNTjG" });
        }
    }
}
