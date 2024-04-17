using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class RoleFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProjectRoles_Name",
                table: "ProjectRoles");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 12, 17, 460, DateTimeKind.Local).AddTicks(7412), "$2a$10$WybggFcdM/G0Uu5j5pOR5uGwCGPGJgY8UQ7/UT4MLDrQQuWTyZkXm" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 12, 17, 523, DateTimeKind.Local).AddTicks(1683), "$2a$10$c9TUQHi5jW5eTtSIZDQX5OsqV9a5Wh51DxeXyucAdBm8F8QsFFsDW" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 12, 17, 586, DateTimeKind.Local).AddTicks(1492), "$2a$10$NDH6lS8O.Q5EHgKNAgJgW.5C.e8xA0IjpB.Z9FYjYgZS7BMNKAoRq" });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectPermissions_Name",
                table: "ProjectPermissions",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProjectPermissions_Name",
                table: "ProjectPermissions");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 9, 38, 104, DateTimeKind.Local).AddTicks(1934), "$2a$10$2SKJUHSDOzuJ673h4corkOK0EJqdIgb7pQ0LRpgiklg8t68aEjo16" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 9, 38, 166, DateTimeKind.Local).AddTicks(5061), "$2a$10$ykxrq8dxaZfs5ovWtOHRv..kcTI12qbFtPXmnBkt2yunh7aLSC8U2" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 17, 22, 9, 38, 229, DateTimeKind.Local).AddTicks(7690), "$2a$10$MboRkQyNJJn/Uqs6rFtEV.T787o96YdSC9cvi8Z0ZNctEGSIE3Jaa" });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectRoles_Name",
                table: "ProjectRoles",
                column: "Name",
                unique: true);
        }
    }
}
