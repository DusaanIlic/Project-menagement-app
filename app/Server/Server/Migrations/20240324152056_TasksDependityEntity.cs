using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class TasksDependityEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TaskDependencies",
                columns: table => new
                {
                    TaskId = table.Column<int>(type: "INTEGER", nullable: false),
                    DependentTaskId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskDependencies", x => new { x.TaskId, x.DependentTaskId });
                    table.ForeignKey(
                        name: "FK_TaskDependencies_ProjectTasks_DependentTaskId",
                        column: x => x.DependentTaskId,
                        principalTable: "ProjectTasks",
                        principalColumn: "TaskId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskDependencies_ProjectTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "ProjectTasks",
                        principalColumn: "TaskId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskDependencies_DependentTaskId",
                table: "TaskDependencies",
                column: "DependentTaskId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TaskDependencies");
        }
    }
}
