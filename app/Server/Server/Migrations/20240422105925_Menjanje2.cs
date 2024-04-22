using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class Menjanje2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_TaskCategories_TaskCategoryID",
                table: "ProjectTasks");

            migrationBuilder.RenameColumn(
                name: "TaskCategoryID",
                table: "ProjectTasks",
                newName: "TaskCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTasks_TaskCategoryID",
                table: "ProjectTasks",
                newName: "IX_ProjectTasks_TaskCategoryId");

            migrationBuilder.AlterColumn<int>(
                name: "TaskCategoryId",
                table: "ProjectTasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 12, 59, 24, 161, DateTimeKind.Local).AddTicks(2614), "$2a$10$TKFuVFFYPFxXk2U.GzVLsu98/ev3QebDYO4/MjycEfp4EQPySrrE2" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 12, 59, 24, 243, DateTimeKind.Local).AddTicks(3986), "$2a$10$JqQPn0LqsHFCh1cyyt9QauepJFJFFqjj2osS1PfJF27TEGmsjCljW" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 12, 59, 24, 330, DateTimeKind.Local).AddTicks(9180), "$2a$10$zuaXMCtmeyJ4cu.h9rsy2e5PDkgceKrmvUey8xgOScTsq3iwEdca2" });

            migrationBuilder.UpdateData(
                table: "TaskCategories",
                keyColumn: "TaskCategoryID",
                keyValue: 1,
                column: "IsDefault",
                value: true);

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

            migrationBuilder.RenameColumn(
                name: "TaskCategoryId",
                table: "ProjectTasks",
                newName: "TaskCategoryID");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectTasks_TaskCategoryId",
                table: "ProjectTasks",
                newName: "IX_ProjectTasks_TaskCategoryID");

            migrationBuilder.AlterColumn<int>(
                name: "TaskCategoryID",
                table: "ProjectTasks",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 12, 47, 23, 612, DateTimeKind.Local).AddTicks(3405), "$2a$10$XpxLKtYqXJe8zaRZpBDQzO/dkbmlU310jysv1/gi0KS/Oduptr3Ue" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 12, 47, 23, 762, DateTimeKind.Local).AddTicks(4847), "$2a$10$gbW.rJ1zNf0Gj6FMoohYWedcNw/Y4EpX0R3//O4ANHSC21DlWu5wu" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 22, 12, 47, 23, 911, DateTimeKind.Local).AddTicks(8600), "$2a$10$U3o3p48L0926xn8O6wWrD.sWRVxxHig.z8rEK1QT0gR6Fjv0O3fBq" });

            migrationBuilder.UpdateData(
                table: "TaskCategories",
                keyColumn: "TaskCategoryID",
                keyValue: 1,
                column: "IsDefault",
                value: false);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_TaskCategories_TaskCategoryID",
                table: "ProjectTasks",
                column: "TaskCategoryID",
                principalTable: "TaskCategories",
                principalColumn: "TaskCategoryID");
        }
    }
}
