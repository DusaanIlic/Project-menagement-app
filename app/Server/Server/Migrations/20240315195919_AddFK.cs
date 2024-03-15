using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectTaskStatusId",
                table: "ProjectTasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_ProjectTaskStatusId",
                table: "ProjectTasks",
                column: "ProjectTaskStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_ProjectTaskStatuses_ProjectTaskStatusId",
                table: "ProjectTasks",
                column: "ProjectTaskStatusId",
                principalTable: "ProjectTaskStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_ProjectTaskStatuses_ProjectTaskStatusId",
                table: "ProjectTasks");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTasks_ProjectTaskStatusId",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "ProjectTaskStatusId",
                table: "ProjectTasks");
        }
    }
}
