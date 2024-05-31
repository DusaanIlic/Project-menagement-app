using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewPerm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 31, 21, 33, 34, 681, DateTimeKind.Local).AddTicks(5027), "$2a$10$cKU7g4Y/0ATcssiatg8OxezqlmLWeAeJuJ0nmmypuPci.ee70RNQy" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 31, 21, 33, 34, 772, DateTimeKind.Local).AddTicks(4526), "$2a$10$lnIm3.wXSHMtV1d1SHMW5eKxcwwpvQ5wDVzjGby8VHLF7sc7AGARW" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 31, 21, 33, 34, 866, DateTimeKind.Local).AddTicks(6581), "$2a$10$F33tQQ3KAAesf9NJv0dTMOv7Lx7zILFDrFb2MJ5.LDIlJ3Nl5DWfm" });

            migrationBuilder.InsertData(
                table: "ProjectPermissions",
                columns: new[] { "Id", "Name" },
                values: new object[] { 29, "Delete task comment" });

            migrationBuilder.InsertData(
                table: "ProjectRolePermissions",
                columns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                values: new object[,]
                {
                    { 29, 1 },
                    { 29, 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 29, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 29, 2 });

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 30, 17, 4, 22, 414, DateTimeKind.Local).AddTicks(4374), "$2a$10$0e/bKZvo8qgbFlpCjv92ceEab.UBcsLvnd0ipOVtHmf8XDJMoQqcO" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 30, 17, 4, 22, 477, DateTimeKind.Local).AddTicks(4082), "$2a$10$itlvPKnRidBEdn/so9J9EeqZLFulbwfRD4FYCPNVJ3meokNeyqVN6" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 30, 17, 4, 22, 541, DateTimeKind.Local).AddTicks(6518), "$2a$10$Ac.qThd5KdMfdSQ7Dv8QlOick36LU/uVVC6bo1cdVtKQylOEeeMLq" });
        }
    }
}
