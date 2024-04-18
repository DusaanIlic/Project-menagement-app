using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewPermission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "ProjectPermissions",
                columns: new[] { "Id", "Name" },
                values: new object[] { 16, "Change task" });

            migrationBuilder.InsertData(
                table: "ProjectRolePermissions",
                columns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                values: new object[] { 16, 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 16, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 2, 25, 40, 881, DateTimeKind.Local).AddTicks(3989), "$2a$10$Z3ffKcPscjJWme4xr0kBkeAiR1/O3shX9.L3AVMt1XdRUaPeyFIAy" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 2, 25, 40, 944, DateTimeKind.Local).AddTicks(6936), "$2a$10$LakM89DIXzJFCsfyfzfpe.F4uMs8NtYkhWCfgM1BvAppLrt2AkAee" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 2, 25, 41, 9, DateTimeKind.Local).AddTicks(7951), "$2a$10$IR.9Tpogc3eRPzWG.H2Dx.AbinujV0ZNRHJuAjjfn4vx4tj1KdAE." });
        }
    }
}
