using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarToMember2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AvatarId",
                table: "Members",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Members_AvatarId",
                table: "Members",
                column: "AvatarId");

            migrationBuilder.AddForeignKey(
                name: "FK_Members_Files_AvatarId",
                table: "Members",
                column: "AvatarId",
                principalTable: "Files",
                principalColumn: "FileId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_Files_AvatarId",
                table: "Members");

            migrationBuilder.DropIndex(
                name: "IX_Members_AvatarId",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "AvatarId",
                table: "Members");
        }
    }
}
