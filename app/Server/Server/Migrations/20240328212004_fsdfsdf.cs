using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class fsdfsdf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UploadedFiles_Members_UploaderId",
                table: "UploadedFiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UploadedFiles",
                table: "UploadedFiles");

            migrationBuilder.RenameTable(
                name: "UploadedFiles",
                newName: "Files");

            migrationBuilder.RenameIndex(
                name: "IX_UploadedFiles_UploaderId",
                table: "Files",
                newName: "IX_Files_UploaderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Files",
                table: "Files",
                column: "FileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Members_UploaderId",
                table: "Files",
                column: "UploaderId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Members_UploaderId",
                table: "Files");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Files",
                table: "Files");

            migrationBuilder.RenameTable(
                name: "Files",
                newName: "UploadedFiles");

            migrationBuilder.RenameIndex(
                name: "IX_Files_UploaderId",
                table: "UploadedFiles",
                newName: "IX_UploadedFiles_UploaderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UploadedFiles",
                table: "UploadedFiles",
                column: "FileId");

            migrationBuilder.AddForeignKey(
                name: "FK_UploadedFiles_Members_UploaderId",
                table: "UploadedFiles",
                column: "UploaderId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
