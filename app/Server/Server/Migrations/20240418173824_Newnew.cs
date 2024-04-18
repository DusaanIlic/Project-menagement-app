using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Newnew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 38, 23, 41, DateTimeKind.Local).AddTicks(8247), "$2a$10$bhSBvZ5Lde69PVHFantsmOyG11Zca0ywxn0osmscmdz6EeULajFD." });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 38, 23, 249, DateTimeKind.Local).AddTicks(8061), "$2a$10$l.KjCuq7sD6DWG1Fk8Rg8OlKpxSpawW0H2ln3BdiW31vE28x8BCEu" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 38, 23, 428, DateTimeKind.Local).AddTicks(4130), "$2a$10$SiyF9g6ED7A9xNBxO436au4wkogLV2B5sEXlvchVM0lodeJjKpHXe" });

            migrationBuilder.InsertData(
                table: "ProjectPermissions",
                columns: new[] { "Id", "Name" },
                values: new object[] { 19, "Comment task" });

            migrationBuilder.InsertData(
                table: "ProjectRolePermissions",
                columns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                values: new object[,]
                {
                    { 19, 1 },
                    { 19, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 19, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 19, 2 });

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 29, 31, 902, DateTimeKind.Local).AddTicks(3918), "$2a$10$/2.HKgwfwJXpUCSnf44RROiTcyq1QSSnuzPfUU3CR45pwn/ouKHlC" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 29, 32, 1, DateTimeKind.Local).AddTicks(174), "$2a$10$pfHZQK0bl6lW4HyQjYsvUOYOK.MSaDk7opObx77MtcRs59RCMSleC" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 29, 32, 117, DateTimeKind.Local).AddTicks(9146), "$2a$10$z98DLXhK2PFcHnzUMICNtOLV.YoKhe9tjq.kP5fYCwuIqcKEBx.VG" });
        }
    }
}
