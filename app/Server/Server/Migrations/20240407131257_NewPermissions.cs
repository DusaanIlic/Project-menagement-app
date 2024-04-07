using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 13, 12, 55, 646, DateTimeKind.Utc).AddTicks(3065), "$2a$10$PbtqDUmB60341JXXWEeaou0bxAauuz.LrmbfBN1b6xYw8v44WNor6" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 13, 12, 55, 758, DateTimeKind.Utc).AddTicks(50), "$2a$10$lIcgVn9fM2o23bNJgL9qPO9mDOcXrr9OayflQU790073zMF63eRp2" });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "PermissionId", "PermissionName" },
                values: new object[] { 13, "Change project" });

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { 12, 2 },
                    { 13, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 12, 2 });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 13, 2 });

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "PermissionId",
                keyValue: 13);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 6, 21, 42, 1, 298, DateTimeKind.Utc).AddTicks(5452), "$2a$10$Ng8RC.3UfhI.Or48wClPPexIPMHhFlCojOiv6NW2lzXmrxod6KaLO" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 6, 21, 42, 1, 385, DateTimeKind.Utc).AddTicks(8986), "$2a$10$D1M.Kk..p1lbyG6S7SSMkO26p2M/VFhmMsKNuauv3erby/r9l2sKm" });
        }
    }
}
