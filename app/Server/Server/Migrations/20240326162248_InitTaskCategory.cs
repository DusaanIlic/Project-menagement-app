using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class InitTaskCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
               table: "TaskCategories",
               columns: new[] { "TaskCategoryID", "CategoryName" },
               values: new object[] { 1, "Undefined" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
            table: "TaskCategories",
            keyColumn: "TaskCategoryID",
            keyValue: 1);
        }
    }
}
