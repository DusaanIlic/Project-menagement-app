using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.AlterColumn<int>(
                name: "ProjectId",
                table: "Projects",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectStatusId",
                table: "Projects",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Projects",
                table: "Projects",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectStatusId",
                table: "Projects",
                column: "ProjectStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_ProjectStatuses_ProjectStatusId",
                table: "Projects",
                column: "ProjectStatusId",
                principalTable: "ProjectStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_ProjectStatuses_ProjectStatusId",
                table: "Projects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Projects",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ProjectStatusId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProjectStatusId",
                table: "Projects");

            migrationBuilder.AlterColumn<int>(
                name: "ProjectId",
                table: "Project",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);
        }
    }
}
