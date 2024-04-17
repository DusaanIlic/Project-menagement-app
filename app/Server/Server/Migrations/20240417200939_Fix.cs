using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Fix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProjectPermissions_Name",
                table: "ProjectPermissions");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 9, 38, 104, DateTimeKind.Local).AddTicks(1934), "$2a$10$2SKJUHSDOzuJ673h4corkOK0EJqdIgb7pQ0LRpgiklg8t68aEjo16" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 9, 38, 166, DateTimeKind.Local).AddTicks(5061), "$2a$10$ykxrq8dxaZfs5ovWtOHRv..kcTI12qbFtPXmnBkt2yunh7aLSC8U2" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 9, 38, 229, DateTimeKind.Local).AddTicks(7690), "$2a$10$MboRkQyNJJn/Uqs6rFtEV.T787o96YdSC9cvi8Z0ZNctEGSIE3Jaa" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateIndex(
                name: "IX_ProjectPermissions_Name",
                table: "ProjectPermissions",
                column: "Name",
                unique: true);
        }
    }
}
