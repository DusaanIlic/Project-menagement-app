using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class TaskFKTaskCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TaskCategoryId",
                table: "ProjectTasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_TaskCategoryId",
                table: "ProjectTasks",
                column: "TaskCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_TaskCategories_TaskCategoryId",
                table: "ProjectTasks",
                column: "TaskCategoryId",
                principalTable: "TaskCategories",
                principalColumn: "TaskCategoryID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_TaskCategories_TaskCategoryId",
                table: "ProjectTasks");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTasks_TaskCategoryId",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "TaskCategoryId",
                table: "ProjectTasks");
        }
    }
}
