using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewPermission3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 8, 12, 35, 0, 422, DateTimeKind.Utc).AddTicks(4949), "$2a$10$FurePKW/whkSfAlKkLy42e0YzwHpvdUQvVMGciooV9BvMPlZ/LxNG" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 8, 12, 35, 0, 570, DateTimeKind.Utc).AddTicks(6897), "$2a$10$Zgt2B0c.gAojpEADzcyYF.jkDvejpFBKvyoygusfVMlMTfcc1nFpy" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 8, 12, 35, 0, 719, DateTimeKind.Utc).AddTicks(8103), "$2a$10$35WN4MwJCrnihRGcaPVPMOYnXsTelZJuP/Taq28Rh77A6RDyiMjqC" });

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[] { 11, 2 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { 11, 2 });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 22, 28, 35, 858, DateTimeKind.Utc).AddTicks(687), "$2a$10$ogpyJIlOKIhbLUEvooRqKeHLQW2z0w..FxiM3zyQVK06InFEfxFV6" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 22, 28, 35, 921, DateTimeKind.Utc).AddTicks(5382), "$2a$10$ZkW0vS/Brat9FJoa29dpJubnObO26Wy7NXmpkwJlBJYHtAikwY0tG" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 22, 28, 35, 986, DateTimeKind.Utc).AddTicks(758), "$2a$10$TxomEKiICyOkFBZP8D4.3.LSedBmEukDLw7eBgbI2OZczTtzDr20K" });
        }
    }
}
