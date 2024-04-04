using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class MigrationFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ProjectStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "Status",
                value: "In Preparation");

            migrationBuilder.InsertData(
                table: "ProjectStatuses",
                columns: new[] { "Id", "Status" },
                values: new object[] { 3, "In Progress" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectStatuses",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "ProjectStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "Status",
                value: "Open");
        }
    }
}
