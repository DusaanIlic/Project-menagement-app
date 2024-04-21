using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectPriorities",
                columns: table => new
                {
                    ProjectPriorityId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectPriorities", x => x.ProjectPriorityId);
                });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectPriorities");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 20, 44, 59, 947, DateTimeKind.Local).AddTicks(2911), "$2a$10$lSOZ3PrMCQrd/j6uJtizuejdZGw2hqJgukZR9tb5lsKH0mm/JIJ12" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 20, 45, 0, 9, DateTimeKind.Local).AddTicks(9155), "$2a$10$ccM6QoxJ./oVR4EwlFn4b.vtMShcmFuQvnW/DTJxhejcRm00P9Kz6" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 20, 45, 0, 73, DateTimeKind.Local).AddTicks(2598), "$2a$10$UtyvX4LEieaipIbuzBWl3u42puArJQ62u0hKD37fGdjHRd/LKw9tC" });
        }
    }
}
