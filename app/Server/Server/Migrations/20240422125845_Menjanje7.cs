using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Menjanje7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_ProjectPriorities_ProjectId",
                table: "Projects");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 58, 43, 686, DateTimeKind.Local).AddTicks(5528), "$2a$10$axI9.s/fv7VcKjCEUV0Q.uTpQWrfm.y2xylbZxE5REzcHvokkyTWa" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 58, 43, 781, DateTimeKind.Local).AddTicks(9795), "$2a$10$r5ejNH7uQ7hBb/0fd1jEseF3o2a4uW/pBjsZaaC9qiZbewV7o2RPe" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 58, 43, 879, DateTimeKind.Local).AddTicks(6301), "$2a$10$KxxE/nH6Uq87a0K9N1b6wOnPd3yc4OVwjSSpjVcq/iaJWuGZVT6RW" });

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

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 47, 38, 870, DateTimeKind.Local).AddTicks(6112), "$2a$10$2w9OwgrG1zBniqqRNnahpuxCzRkhVvGp1l24pUKJYB8Xw/CxDHI92" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 47, 38, 959, DateTimeKind.Local).AddTicks(2596), "$2a$10$gkSWSukjs8tPwcF6iXaKkulYjBwrgLORd63vyEkFQyzs4RCGgRvjC" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 47, 39, 46, DateTimeKind.Local).AddTicks(6953), "$2a$10$Q82rNqVcnPoXT5efssMPjuRJt2Ra3GJlnD0W0XdtNgJHu6jFTu7zO" });

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_ProjectPriorities_ProjectId",
                table: "Projects",
                column: "ProjectId",
                principalTable: "ProjectPriorities",
                principalColumn: "ProjectPriorityId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
