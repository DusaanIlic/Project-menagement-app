using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewInitValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "ProjectPriorities",
                columns: new[] { "ProjectPriorityId", "Name" },
                values: new object[,]
                {
                    { 1, "Low" },
                    { 2, "Medium" },
                    { 3, "High" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectPriorities",
                keyColumn: "ProjectPriorityId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ProjectPriorities",
                keyColumn: "ProjectPriorityId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ProjectPriorities",
                keyColumn: "ProjectPriorityId",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 23, 16, 952, DateTimeKind.Local).AddTicks(540), "$2a$10$Z.n7KnLBVS5ivriOpjaUzexLFQAws6uEy2SgHqvbbvLDgxm80gnD." });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 23, 17, 41, DateTimeKind.Local).AddTicks(2834), "$2a$10$1ZXx3iI0Zh6rpbTZ435JmODDF4cIZyA6sICPRP.NP2jVF2Hn55ry." });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 23, 17, 138, DateTimeKind.Local).AddTicks(5575), "$2a$10$P5kaf2n2bQ7.DO7BJ1KRfudHwUnR4DD2aX1KRnS/LC2nWnqwPJWTm" });
        }
    }
}
