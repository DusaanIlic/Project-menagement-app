using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Menjanje5 : Migration
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
                values: new object[] { new DateTime(2024, 4, 22, 14, 40, 5, 261, DateTimeKind.Local).AddTicks(1544), "$2a$10$X/6ZD4qSjOYcQizij84oe.x/kxPoYts5xBp/5FxzM23wNb0E0UTL6" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 40, 5, 395, DateTimeKind.Local).AddTicks(4401), "$2a$10$8i4Jxno.bTQq38/nOMAj4OmV5VfoSGgeW91jixvnikfs3QkUZ0z0m" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 40, 5, 635, DateTimeKind.Local).AddTicks(8287), "$2a$10$RyyFtqeNvfYFLz0t5miSxuGCEowsKZyfCWhiyknv17FjFyBweQEQG" });

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

            migrationBuilder.DropTable(
              name: "ProjectPriorities");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 37, 4, 63, DateTimeKind.Local).AddTicks(7338), "$2a$10$CAFeLk6eRpTVeOmUnSv60u9gCWyKQjFix9gbvGxYQPsoDFZuSiOWS" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 37, 4, 263, DateTimeKind.Local).AddTicks(9673), "$2a$10$63cZeE/w7aM11gkSZvLt1eV3d4ogdmhGvgzB5hwW4HwrK7V3lXXyS" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 14, 37, 4, 440, DateTimeKind.Local).AddTicks(8966), "$2a$10$RMjB4wdGSBnFR4qx/CCXzewnB2GbWKUrCSktWckkK8qLg69M4QStq" });

            
        }
    }
}
