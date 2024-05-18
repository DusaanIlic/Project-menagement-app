using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateProjectFileEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectFile",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    FileId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectFile", x => new { x.ProjectId, x.FileId });
                    table.ForeignKey(
                        name: "FK_ProjectFile_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "FileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectFile_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 16, 14, 45, 36, 975, DateTimeKind.Local).AddTicks(8279), "$2a$10$k0NTtMfSrlqQWQvE6yLeK.sc4QO82xCGnzOrKpdAP3j9B7ihvDS5G" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 16, 14, 45, 37, 84, DateTimeKind.Local).AddTicks(4098), "$2a$10$C/I1lZyygFZFTMrCNPj.eOMEy2b4G.3TbPGOZKJ3YnM2couhmdHSa" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 16, 14, 45, 37, 181, DateTimeKind.Local).AddTicks(5154), "$2a$10$GO39f1jzz1PsF8BTd.JRduOed/raQ5UJwdgFwKjLzcMCp4zGrcRQi" });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectFile_FileId",
                table: "ProjectFile",
                column: "FileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectFile");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 24, 21, 14, 17, 871, DateTimeKind.Local).AddTicks(2517), "$2a$10$QyAu36huU7zZhTXQB4oTCOlkXxHdCvMtlEIUcO1uwGWvDHkutkU0G" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 24, 21, 14, 17, 933, DateTimeKind.Local).AddTicks(5170), "$2a$10$xgA8jCzkT0Kb6DNEmb9vqubJEX7OSXp1h6ar8ino.I/QKa64vl8zu" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 24, 21, 14, 17, 996, DateTimeKind.Local).AddTicks(1226), "$2a$10$mtqtYllhFMiHqqu3O9/0wOr5vjSnOj1WVZnpANxUAMYfJZCpMED8e" });
        }
    }
}
