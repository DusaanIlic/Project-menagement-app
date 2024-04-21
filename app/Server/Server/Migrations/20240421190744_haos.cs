using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class haos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 21, 21, 7, 42, 975, DateTimeKind.Local).AddTicks(5554), "$2a$10$2uv8/UNh9qfJqekXjVp6P.nleL052aHOQDIx93.bSb/EMCPOWEquC" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 21, 21, 7, 43, 62, DateTimeKind.Local).AddTicks(669), "$2a$10$/wvLIdmicmFcsOw5wrjk7eDhjXRTPTCe2puRWyEXtVpgyYnJ.aaw6" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 21, 21, 7, 43, 148, DateTimeKind.Local).AddTicks(3668), "$2a$10$psHQaT3p1hFtq6H20MfJJOHQoOBPGD18DVvC.BNfdwUNuV0tAqphG" });

            migrationBuilder.InsertData(
                table: "ProjectPermissions",
                columns: new[] { "Id", "Name" },
                values: new object[] { 20, "Change project priority" });

            migrationBuilder.InsertData(
                table: "ProjectRolePermissions",
                columns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                values: new object[] { 20, 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectRolePermissions",
                keyColumns: new[] { "ProjectPermissionId", "ProjectRoleId" },
                keyValues: new object[] { 20, 1 });

            migrationBuilder.DeleteData(
                table: "ProjectPermissions",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 27, 20, 406, DateTimeKind.Local).AddTicks(5518), "$2a$10$PJW1XmWLydq8Lw9I66JU7uq2bEMUS/ZFxtIWGeVQ9cfabDQFgp3fe" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 27, 20, 497, DateTimeKind.Local).AddTicks(7125), "$2a$10$JTWa8JAVdNFfBS6/lvsG8.xdzpOmwYuimLFK1JqOoNm2dUwbMYjCS" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 27, 20, 606, DateTimeKind.Local).AddTicks(1958), "$2a$10$TU.q9rg7OkJoIaKke6m.ROjD0opm./9qImqH3NLxODvVF.37VyCfO" });
        }
    }
}
