using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class NewFieldMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDisabled",
                table: "Members",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "IsDisabled", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 11, 23, 30, 433, DateTimeKind.Utc).AddTicks(5342), false, "$2a$10$SHlDdCwMiyAZNbLTMg/rEOra5M7cSVPQF8k/Sn6JYJO2ssiidh9KG" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "IsDisabled", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 11, 23, 30, 581, DateTimeKind.Utc).AddTicks(9965), false, "$2a$10$WnDBqFbuoJeAndFgx2KSb.S5A2W6CBXuqTpDE1A/VasfEZxF4Qkdm" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "IsDisabled", "Password" },
                values: new object[] { new DateTime(2024, 4, 9, 11, 23, 30, 802, DateTimeKind.Utc).AddTicks(7530), false, "$2a$10$tBMiyjI6ULE4IN5RIBYZr.sULx4ZVE3T14/o2lyA0iMTO07HOnZs2" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDisabled",
                table: "Members");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 8, 12, 35, 0, 422, DateTimeKind.Utc).AddTicks(4949), "$2a$10$FurePKW/whkSfAlKkLy42e0YzwHpvdUQvVMGciooV9BvMPlZ/LxNG" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 8, 12, 35, 0, 570, DateTimeKind.Utc).AddTicks(6897), "$2a$10$Zgt2B0c.gAojpEADzcyYF.jkDvejpFBKvyoygusfVMlMTfcc1nFpy" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 8, 12, 35, 0, 719, DateTimeKind.Utc).AddTicks(8103), "$2a$10$35WN4MwJCrnihRGcaPVPMOYnXsTelZJuP/Taq28Rh77A6RDyiMjqC" });
        }
    }
}
