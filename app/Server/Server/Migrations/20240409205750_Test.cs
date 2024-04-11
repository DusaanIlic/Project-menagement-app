using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 20, 57, 47, 910, DateTimeKind.Utc).AddTicks(9720), "$2a$10$gJ7izscilwtCfg2U5sxug.fy6tDVzeDRHPeB3dmqCx14I9lkUuErC" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 20, 57, 47, 998, DateTimeKind.Utc).AddTicks(8578), "$2a$10$B3nypLV2.M5Qt4pWlowoBOUcmevMF7Is5KtUVljvTN8WP45kbQdti" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 20, 57, 48, 85, DateTimeKind.Utc).AddTicks(6188), "$2a$10$FPq1JCgWe9Yhk7xYt4lgju.SHVQi2TEesPOa.CSwXM/Izt/gxInYm" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 16, 34, 46, 897, DateTimeKind.Utc).AddTicks(4835), "$2a$10$TFfiG/doikCZJQF5zbK2Qep7ApHzJ3HxZaAExuFEhyOyJLEj1J79G" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 16, 34, 46, 973, DateTimeKind.Utc).AddTicks(3441), "$2a$10$Eptv0KP0u5RnhL3nnT9jpuzalyz.5sRUBv09HPpxSp2wM3r9YL2qa" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 16, 34, 47, 38, DateTimeKind.Utc).AddTicks(7184), "$2a$10$9FAbKv47X1uuLOpvFmL1Ve1YMqIEALBcJSAQR1otkqalnNE9pfGFO" });
        }
    }
}
