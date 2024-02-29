using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApp_Veljko.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlHandle",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "FeaturedImageUrl",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "PublishedTime",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "UrlHandle",
                table: "BlogPosts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlHandle",
                table: "Categories",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FeaturedImageUrl",
                table: "BlogPosts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "BlogPosts",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedTime",
                table: "BlogPosts",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UrlHandle",
                table: "BlogPosts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
