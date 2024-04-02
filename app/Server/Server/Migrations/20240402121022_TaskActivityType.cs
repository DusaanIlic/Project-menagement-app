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
                name: "TaskActivityTypeId",
                table: "TaskActivities",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TaskActivityTypes",
                columns: table => new
                {
                    TaskActivityTypeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TaskActivityName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskActivityTypes", x => x.TaskActivityTypeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskActivities_TaskActivityTypeId",
                table: "TaskActivities",
                column: "TaskActivityTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskActivities_TaskActivityTypes_TaskActivityTypeId",
                table: "TaskActivities",
                column: "TaskActivityTypeId",
                principalTable: "TaskActivityTypes",
                principalColumn: "TaskActivityTypeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskActivities_TaskActivityTypes_TaskActivityTypeId",
                table: "TaskActivities");

            migrationBuilder.DropTable(
                name: "TaskActivityTypes");

            migrationBuilder.DropIndex(
                name: "IX_TaskActivities_TaskActivityTypeId",
                table: "TaskActivities");

            migrationBuilder.DropColumn(
                name: "TaskActivityTypeId",
                table: "TaskActivities");
        }
    }
}
