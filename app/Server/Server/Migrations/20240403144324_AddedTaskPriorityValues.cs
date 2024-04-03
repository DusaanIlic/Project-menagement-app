using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedTaskPriorityValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "TaskPriority",
                columns: new[] { "TaskPriorityId", "Name" },
                values: new object[,]
                {
                    { 1, "Low" },
                    { 2, "Medium" },
                    { 3, "High" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TaskPriority",
                keyColumn: "TaskPriorityId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "TaskPriority",
                keyColumn: "TaskPriorityId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "TaskPriority",
                keyColumn: "TaskPriorityId",
                keyValue: 3);
        }
    }
}
