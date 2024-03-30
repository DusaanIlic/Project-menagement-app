using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldsToMember3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_Files_AvatarId",
                table: "Members");

            migrationBuilder.AlterColumn<int>(
                name: "AvatarId",
                table: "Members",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Members_Files_AvatarId",
                table: "Members",
                column: "AvatarId",
                principalTable: "Files",
                principalColumn: "FileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_Files_AvatarId",
                table: "Members");

            migrationBuilder.AlterColumn<int>(
                name: "AvatarId",
                table: "Members",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Members_Files_AvatarId",
                table: "Members",
                column: "AvatarId",
                principalTable: "Files",
                principalColumn: "FileId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
