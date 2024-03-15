using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddInitialDataProjectTaskStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
            table: "ProjectTaskStatuses",
            columns: new[] { "Id", "Name" },
            values: new object[,]
            {
               { 1, "New" },
               { 2, "Started" },
               { 3, "In Progress" },
               { 4, "Completed" }
            });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
            table: "ProjectTaskStatuses",
            keyColumn: "Id",
            keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ProjectTaskStatuses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ProjectTaskStatuses",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
        table: "ProjectTaskStatuses",
        keyColumn: "Id",
        keyValue: 4);
        }
    }
}
