using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddInitialDataProjectStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
        table: "ProjectStatuses",
        columns: new[] { "Id", "Status" },
        values: new object[,]
        {
             {1, "In Preparation" },
            { 2, "Started" },
            { 3, "In Progress" },
            { 4, "Closed" },
        });
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
                table: "ProjectStatuses",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ProjectStatuses",
                keyColumn: "Id",
                keyValue: 4);

        }
    }
}
