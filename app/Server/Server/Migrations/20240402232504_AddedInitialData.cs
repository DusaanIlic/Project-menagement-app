using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ProjectStatuses",
                columns: new[] { "Id", "Status" },
                values: new object[,]
                {
                    { 1, "Open" },
                    { 2, "Closed" }
                });

            migrationBuilder.InsertData(
                table: "TaskCategories",
                columns: new[] { "TaskCategoryID", "CategoryName" },
                values: new object[] { 1, "None" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProjectStatuses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ProjectStatuses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "TaskCategories",
                keyColumn: "TaskCategoryID",
                keyValue: 1);
        }
    }
}
