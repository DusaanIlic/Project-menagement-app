using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddInitialProjectStatusData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ProjectStatuses",
                columns: new[] { "Id", "Status" },
                values: new object[,]
                {
                   { 1, "Started" },
                   { 2, "In Progress" },
                   { 3, "Closed" },
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
            table: "ProjectStatus",
        keyColumn: "Id",
        keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ProjectStatus",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ProjectStatus",
                keyColumn: "Id",
                keyValue: 3);

        }
    }
}
