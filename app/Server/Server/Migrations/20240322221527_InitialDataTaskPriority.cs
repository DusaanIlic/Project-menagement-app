using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialDataTaskPriority : Migration
    {
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
