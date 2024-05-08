using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Color : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PriorityColorHex",
                table: "TaskPriority",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PriorityColorHex",
                table: "ProjectPriorities",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 20, 52, 46, 114, DateTimeKind.Local).AddTicks(8265), "$2a$10$lKWSpKmvTL2XvmJLC4LRLua3GCGfesR2lxUEzW5.t1HxVL8S6dBmW" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 20, 52, 46, 245, DateTimeKind.Local).AddTicks(245), "$2a$10$ZlomzYQRVEVV1h9Ff9fapOtnHWLPaEJCQDxP8k4yxpJ/Oj7/aSeBm" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 20, 52, 46, 410, DateTimeKind.Local).AddTicks(6163), "$2a$10$9ndbyMIzO.ctIChz9H2SreNkRlnG26p8k2we8yATJYDjCjmhZFoQe" });

            migrationBuilder.UpdateData(
                table: "ProjectPriorities",
                keyColumn: "ProjectPriorityId",
                keyValue: 1,
                column: "PriorityColorHex",
                value: "");

            migrationBuilder.UpdateData(
                table: "ProjectPriorities",
                keyColumn: "ProjectPriorityId",
                keyValue: 2,
                column: "PriorityColorHex",
                value: "");

            migrationBuilder.UpdateData(
                table: "ProjectPriorities",
                keyColumn: "ProjectPriorityId",
                keyValue: 3,
                column: "PriorityColorHex",
                value: "");

            migrationBuilder.UpdateData(
                table: "TaskPriority",
                keyColumn: "TaskPriorityId",
                keyValue: 1,
                column: "PriorityColorHex",
                value: "");

            migrationBuilder.UpdateData(
                table: "TaskPriority",
                keyColumn: "TaskPriorityId",
                keyValue: 2,
                column: "PriorityColorHex",
                value: "");

            migrationBuilder.UpdateData(
                table: "TaskPriority",
                keyColumn: "TaskPriorityId",
                keyValue: 3,
                column: "PriorityColorHex",
                value: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriorityColorHex",
                table: "TaskPriority");

            migrationBuilder.DropColumn(
                name: "PriorityColorHex",
                table: "ProjectPriorities");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 11, 26, 55, 37, DateTimeKind.Local).AddTicks(109), "$2a$10$8s5HYO7jcTnEgrLcBxudzOLnPTOuJ6bFiVrj4U6/8aUWjv25NoG2C" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 11, 26, 55, 135, DateTimeKind.Local).AddTicks(2931), "$2a$10$vdhcnF/aIsCHW6ev8qpaV.BLIlg5u.yHnXyhl5KD3LUnIJI3mP7Kq" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 5, 8, 11, 26, 55, 259, DateTimeKind.Local).AddTicks(1629), "$2a$10$FDm9ie7jPEGVXfBiezDLp.LdR84//yeuJxqR079KiYEyh56f9Pi0O" });
        }
    }
}
