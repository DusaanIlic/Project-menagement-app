using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFKTaskComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TaskId",
                table: "TaskComments",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 46, 58, 925, DateTimeKind.Local).AddTicks(1654), "$2a$10$uZk0dgrDtnV0z7hzHhpG6eFeAgxDNRaNP.RLtI28Q/dAHrsgwDH6K" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 46, 59, 62, DateTimeKind.Local).AddTicks(3570), "$2a$10$/tGx33YkOWirTf77veUX.OCS3BziHey1y5o2Lm8REIzNX4YdlOG2W" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 46, 59, 244, DateTimeKind.Local).AddTicks(5010), "$2a$10$T9fgJTJ05pT/a2iEnkRKkee0cwkLAOsgh9i5Nlk5vgfFZZYcQ.kVe" });

            migrationBuilder.CreateIndex(
                name: "IX_TaskComments_TaskId",
                table: "TaskComments",
                column: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskComments_ProjectTasks_TaskId",
                table: "TaskComments",
                column: "TaskId",
                principalTable: "ProjectTasks",
                principalColumn: "TaskId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskComments_ProjectTasks_TaskId",
                table: "TaskComments");

            migrationBuilder.DropIndex(
                name: "IX_TaskComments_TaskId",
                table: "TaskComments");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "TaskComments");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 38, 23, 41, DateTimeKind.Local).AddTicks(8247), "$2a$10$bhSBvZ5Lde69PVHFantsmOyG11Zca0ywxn0osmscmdz6EeULajFD." });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 38, 23, 249, DateTimeKind.Local).AddTicks(8061), "$2a$10$l.KjCuq7sD6DWG1Fk8Rg8OlKpxSpawW0H2ln3BdiW31vE28x8BCEu" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 18, 19, 38, 23, 428, DateTimeKind.Local).AddTicks(4130), "$2a$10$SiyF9g6ED7A9xNBxO436au4wkogLV2B5sEXlvchVM0lodeJjKpHXe" });
        }
    }
}
