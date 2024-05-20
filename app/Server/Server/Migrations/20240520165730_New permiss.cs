using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Newpermiss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "ProjectPermissions",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 25, "Add file" },
                    { 26, "Remove file" }
                });

            migrationBuilder.InsertData(
                table: "ProjectRolePermissions",
                columns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                values: new object[,]
                {
                    { 25, 2 },
                    { 26, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 25, 2 });

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 26, 2 });

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 20, 18, 51, 11, 952, DateTimeKind.Local).AddTicks(1022), "$2a$10$yDJWn66lHo.4X0Epk6tWVO4rbT6vYULVsnjSDAjmgt3vmsfZGuDe." });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 20, 18, 51, 12, 173, DateTimeKind.Local).AddTicks(3218), "$2a$10$/45E2f.0KOUV0wKy4AhMFeOlb9Gzbb1xnkXYfnsxiE94bgEwBpbEi" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 20, 18, 51, 12, 371, DateTimeKind.Local).AddTicks(7180), "$2a$10$00sR.OQPr.uDAYIxyAycY.ZICOdQDPlHTC/7FK9iqnq6b0qyqJZDG" });
        }
    }
}
