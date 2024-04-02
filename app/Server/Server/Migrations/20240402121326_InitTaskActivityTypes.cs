using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class InitTaskActivityTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
               table: "TaskActivityTypes",
               columns: new[] { "TaskActitivityTypeId", "TaskAcitivityName" },
               values: new object[,]
                {
                { 1, "Review" },
                { 2, "Update" },
                { 3, "Bug fix" }
                });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TaskActivityTypes",
                keyColumn: "TaskActitivityTypeID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "TaskActivityTypes",
                keyColumn: "TaskActitivityTypeID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "TaskActivityTypes",
                keyColumn: "TaskActitivityTypeID",
                keyValue: 3);

        }
    }
}
