using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class dsfgdfgfdg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UploadedFiles",
                table: "UploadedFiles");

            migrationBuilder.AlterColumn<int>(
                name: "FileId",
                table: "UploadedFiles",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UploadedFiles",
                table: "UploadedFiles",
                column: "FileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UploadedFiles",
                table: "UploadedFiles");

            migrationBuilder.AlterColumn<int>(
                name: "FileId",
                table: "UploadedFiles",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UploadedFiles",
                table: "UploadedFiles",
                column: "FilePath");
        }
    }
}
