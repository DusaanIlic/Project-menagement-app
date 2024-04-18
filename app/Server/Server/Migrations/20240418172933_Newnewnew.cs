using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Newnewnew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "ProjectPermissions",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 17, "Add task activity" },
                    { 18, "Remove task acitivity" }
                });

            migrationBuilder.InsertData(
                table: "ProjectRolePermissions",
                columns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                values: new object[,]
                {
                    { 17, 1 },
                    { 18, 1 },
                    { 17, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 17, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 18, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 17, 2 });

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 18, 31, 35, 272, DateTimeKind.Local).AddTicks(5051), "$2a$10$fnns20LWVB/.WXyhP8X3oOrbkMrN8Mp.9MkNqHmQcafHQ./oB1PWC" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 18, 31, 35, 359, DateTimeKind.Local).AddTicks(2167), "$2a$10$g/LXCULKVrR.jcggCK0Gz.ZCXMkYOroDAyFlPefo4OrZFf4ANInH." });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 18, 31, 35, 452, DateTimeKind.Local).AddTicks(6388), "$2a$10$.fXSUIHdBlGDrdcWNS9UlOT0jJsW4dZDmrVPZD/MyPYwgsJ2Nfef." });
        }
    }
}
