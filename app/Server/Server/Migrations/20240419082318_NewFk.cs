using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectPriorityId",
                table: "Projects",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectPriorityId",
                table: "Projects",
                column: "ProjectPriorityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_ProjectPriorities_ProjectPriorityId",
                table: "Projects",
                column: "ProjectPriorityId",
                principalTable: "ProjectPriorities",
                principalColumn: "ProjectPriorityId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_ProjectPriorities_ProjectPriorityId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ProjectPriorityId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProjectPriorityId",
                table: "Projects");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 17, 26, 398, DateTimeKind.Local).AddTicks(9515), "$2a$10$H8PWQg1YEOjj./6z3St9QOlNJyewLmwFmgAF/Q4z8mAAlGlYYmike" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 17, 26, 479, DateTimeKind.Local).AddTicks(7490), "$2a$10$NmThjuIV.XeQ8aawqyMKOeuLgXZ7HwkePdqKI54Q1czW7537q5Y.q" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 19, 10, 17, 26, 565, DateTimeKind.Local).AddTicks(7556), "$2a$10$nShQ6K2BXG645zd2w6zMKONYlz37okY5IgoXQw6W2IaN9SB0zPj7y" });
        }
    }
}
