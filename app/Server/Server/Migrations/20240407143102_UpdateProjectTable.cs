using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProjectTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MemberProjects",
                columns: table => new
                {
                    MemberId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberProjects", x => new { x.MemberId, x.ProjectId });
                    table.ForeignKey(
                        name: "FK_MemberProjects_Members_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MemberProjects_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 14, 31, 1, 345, DateTimeKind.Utc).AddTicks(1954), "$2a$10$DV3yQu.XQaTWoEhQUne9aOoFmSP0ZYBubBIjGESj.HZdjLxYiS0J2" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 14, 31, 1, 464, DateTimeKind.Utc).AddTicks(2510), "$2a$10$rbdugYFDIikRGR46sPyi6OJY9g3ndCSIb.41LI9HkrHcEtgwm..Zy" });

            migrationBuilder.CreateIndex(
                name: "IX_MemberProjects_ProjectId",
                table: "MemberProjects",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MemberProjects");

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 13, 38, 20, 533, DateTimeKind.Utc).AddTicks(9556), "$2a$10$8KcIUSLq2PcbWxsm8XD.POCsxsv1xYihzApDfTh/iWnVTv18BWZ7C" });

            migrationBuilder.UpdateData(
                table: "Members",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DateAdded", "Password" },
                values: new object[] { new DateTime(2024, 4, 7, 13, 38, 20, 639, DateTimeKind.Utc).AddTicks(2201), "$2a$10$..ldD8u2/mYpKITiFiIFBupEBMiF6LnnKHMfatXEr61kWsoLPAMfW" });
        }
    }
}
