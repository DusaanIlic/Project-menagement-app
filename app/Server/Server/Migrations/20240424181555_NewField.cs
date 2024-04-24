using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateFinished",
                table: "ProjectTasks",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateFinished",
                table: "Projects",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 24, 20, 15, 53, 677, DateTimeKind.Local).AddTicks(6180), "$2a$10$DXMaY5Uu3Bx06YYA0uMngOXCBXCfaw3lsnXyapMIIMvFEJqLOZ1r6" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 24, 20, 15, 53, 777, DateTimeKind.Local).AddTicks(1570), "$2a$10$pTUCphPeHowO/GOSEfAh.uiBwz3IYKoBGN.k1p9fdedZF0LU/n5Ze" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 24, 20, 15, 53, 866, DateTimeKind.Local).AddTicks(7792), "$2a$10$jlfUu.O.HdZS2OnwdRw3Z.iI1KJCc3/c5ZZ5VZ2g/sek3K0vA0fJq" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateFinished",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "DateFinished",
                table: "Projects");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 23, 22, 15, 33, 870, DateTimeKind.Local).AddTicks(7087), "$2a$10$qfDWTV3QFdkTKDqU/GQzje7kGYeTRfmlQtftU4Vkg7f4BHOjiIGoK" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 23, 22, 15, 33, 957, DateTimeKind.Local).AddTicks(5786), "$2a$10$oUp.2XTTzDuuA0Toa.eFhul6qr9aMlafZHlyAkDpwnFWAYiIwWsea" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 23, 22, 15, 34, 46, DateTimeKind.Local).AddTicks(1728), "$2a$10$jpbRXG32Sak0w8pVdA9CbOZmgPQSztA1rqj7PI2USwzn5bStQnfFi" });
        }
    }
}
