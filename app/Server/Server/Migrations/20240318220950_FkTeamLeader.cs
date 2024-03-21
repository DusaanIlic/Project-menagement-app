using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class FkTeamLeader : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeadLine",
                table: "ProjectTasks",
                newName: "Deadline");

            migrationBuilder.RenameColumn(
                name: "DeadLine",
                table: "Projects",
                newName: "Deadline");

            migrationBuilder.AddColumn<int>(
                name: "TeamLeaderId",
                table: "Projects",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TeamLeaderId",
                table: "Projects",
                column: "TeamLeaderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Members_TeamLeaderId",
                table: "Projects",
                column: "TeamLeaderId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Members_TeamLeaderId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_TeamLeaderId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "TeamLeaderId",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "Deadline",
                table: "ProjectTasks",
                newName: "DeadLine");

            migrationBuilder.RenameColumn(
                name: "Deadline",
                table: "Projects",
                newName: "DeadLine");
        }
    }
}
