using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedColumnToTaskStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "TaskStatuses",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "TaskStatuses",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsDefault",
                value: true);

            migrationBuilder.UpdateData(
                table: "TaskStatuses",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsDefault",
                value: true);

            migrationBuilder.UpdateData(
                table: "TaskStatuses",
                keyColumn: "Id",
                keyValue: 3,
                column: "IsDefault",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "TaskStatuses");
        }
    }
}
