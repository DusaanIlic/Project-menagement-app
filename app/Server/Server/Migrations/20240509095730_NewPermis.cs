using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewPermis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 9, 11, 57, 28, 572, DateTimeKind.Local).AddTicks(6425), "$2a$10$hH7/eKQnIEKeIUBB/8QZzuWPeKpAx581v2b5s8BqvP4XCmZFwdShS" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 9, 11, 57, 28, 662, DateTimeKind.Local).AddTicks(552), "$2a$10$dIgg/svnFMoYZvBDJKjUF.hbz77zfoo3tah4/afy4vOHckuMNcCcW" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 9, 11, 57, 28, 749, DateTimeKind.Local).AddTicks(6624), "$2a$10$aAU63Rjete0vegF6SUN7.ePA4p4kQVRj6d9KQEI5h/AZnGHmA9HNW" });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "PermissionId", "PermissionName" },
                values: new object[] { 6, "Change project deadline" });

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[] { 6, 2 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 6, 2 });

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "PermissionId",
                keyValue: 6);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 20, 57, 56, 169, DateTimeKind.Local).AddTicks(4970), "$2a$10$9IuongYV4qoLKoOIJEpmFO9.QkamwkTIxGZB9X4qt9ceobcKe0mWy" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 20, 57, 56, 251, DateTimeKind.Local).AddTicks(1955), "$2a$10$9dqQMGcPQ6NMNjMEp37wjeVdqVQCvJL1ht4V3MlZzOALZPRWyBBi2" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 20, 57, 56, 337, DateTimeKind.Local).AddTicks(8283), "$2a$10$T2ajLlAaudButHKHPUGkwuD3XdUqD07foU2HHe0blezen9fQoksOu" });
        }
    }
}
