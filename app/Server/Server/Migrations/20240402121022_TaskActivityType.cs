using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class TaskActivityType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TaskAcitivityTypeId",
                table: "TaskActivities",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TaskActivityTypes",
                columns: table => new
                {
                    TaskActitivityTypeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TaskAcitivityName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskActivityTypes", x => x.TaskActitivityTypeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskActivities_TaskAcitivityTypeId",
                table: "TaskActivities",
                column: "TaskAcitivityTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskActivities_TaskActivityTypes_TaskAcitivityTypeId",
                table: "TaskActivities",
                column: "TaskAcitivityTypeId",
                principalTable: "TaskActivityTypes",
                principalColumn: "TaskActitivityTypeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskActivities_TaskActivityTypes_TaskAcitivityTypeId",
                table: "TaskActivities");

            migrationBuilder.DropTable(
                name: "TaskActivityTypes");

            migrationBuilder.DropIndex(
                name: "IX_TaskActivities_TaskAcitivityTypeId",
                table: "TaskActivities");

            migrationBuilder.DropColumn(
                name: "TaskAcitivityTypeId",
                table: "TaskActivities");
        }
    }
}
