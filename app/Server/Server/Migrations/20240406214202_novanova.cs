using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class novanova : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Members",
                columns: new[] { "Id", "AvatarId", "City", "Country", "DateAdded", "DateOfBirth", "Email", "FirstName", "Github", "LastName", "Linkedin", "Password", "PhoneNumber", "RoleId", "Status" },
                values: new object[,]
                {
                    { 2, null, "", "", new DateTime(2024, 4, 6, 21, 42, 1, 298, DateTimeKind.Utc).AddTicks(5452), new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "pera@gmail.com", "Pera", "", "Peric", "", "$2a$10$Ng8RC.3UfhI.Or48wClPPexIPMHhFlCojOiv6NW2lzXmrxod6KaLO", "", 2, "" },
                    { 3, null, "", "", new DateTime(2024, 4, 6, 21, 42, 1, 385, DateTimeKind.Utc).AddTicks(8986), new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "toma@gmail.com", "Toma", "", "Tomic", "", "$2a$10$D1M.Kk..p1lbyG6S7SSMkO26p2M/VFhmMsKNuauv3erby/r9l2sKm", "", 3, "" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
