using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 18, 16, 42, 45, 214, DateTimeKind.Local).AddTicks(6550), "$2a$10$txCZs46gTt11rubKB3oWT.Zh5dfC8QMispd0LKxNmd65GlosNCFNW" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 18, 16, 42, 45, 310, DateTimeKind.Local).AddTicks(8312), "$2a$10$KXZhqi.wDySCwVA.ei5q/.qptPdyQjrddmdEmyHXTvW..DDBzOSGO" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 18, 16, 42, 45, 409, DateTimeKind.Local).AddTicks(4187), "$2a$10$KMoVBuumwXbR1wyvVHOGZeBu86P6I8ryJd4SlxEc1FuDQ/yvcRR4K" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 16, 12, 3, 24, 910, DateTimeKind.Local).AddTicks(3109), "$2a$10$.o8rrb2DB0h9a5yZ7ZZ9a.uy6.eskjkbqdaJCChI6etWJeafZA9hC" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 16, 12, 3, 24, 972, DateTimeKind.Local).AddTicks(3225), "$2a$10$AzBHNfIGV2MrSJTU/ge4q.FVkIErTRTYIN./D1C3GTDSnRlEh.EBi" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 16, 12, 3, 25, 34, DateTimeKind.Local).AddTicks(2300), "$2a$10$sywdToX0Be4HxLIVcweQ4OGtukl9v6.FGDbo7.RaLnqcnkhBtspdu" });
        }
    }
}
