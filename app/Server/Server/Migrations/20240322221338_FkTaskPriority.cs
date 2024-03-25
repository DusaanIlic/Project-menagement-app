using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class FkTaskPriority : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "ProjectTasks",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "TaskPriorityId",
                table: "ProjectTasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TaskPriority",
                columns: table => new
                {
                    TaskPriorityId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskPriority", x => x.TaskPriorityId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_TaskPriorityId",
                table: "ProjectTasks",
                column: "TaskPriorityId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_TaskPriority_TaskPriorityId",
                table: "ProjectTasks",
                column: "TaskPriorityId",
                principalTable: "TaskPriority",
                principalColumn: "TaskPriorityId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_TaskPriority_TaskPriorityId",
                table: "ProjectTasks");

            migrationBuilder.DropTable(
                name: "TaskPriority");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTasks_TaskPriorityId",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "ProjectTasks");

            migrationBuilder.DropColumn(
                name: "TaskPriorityId",
                table: "ProjectTasks");
        }
    }
}
