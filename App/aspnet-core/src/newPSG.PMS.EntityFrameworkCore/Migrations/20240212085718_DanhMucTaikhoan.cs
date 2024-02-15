using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPSG.PMS.Migrations
{
    public partial class DanhMucTaikhoan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DM_TaiKhoan",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    CreatorUserId = table.Column<long>(nullable: true),
                    LastModificationTime = table.Column<DateTime>(nullable: true),
                    LastModifierUserId = table.Column<long>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    DeleterUserId = table.Column<long>(nullable: true),
                    DeletionTime = table.Column<DateTime>(nullable: true),
                    SoTaiKhoan = table.Column<string>(nullable: false),
                    TenTaiKhoan = table.Column<string>(maxLength: 100, nullable: false),
                    TenTiengAnh = table.Column<string>(nullable: false),
                    TinhChat = table.Column<int>(nullable: false),
                    DienGiai = table.Column<string>(nullable: true),
                    CoHachToanNgoaiTe = table.Column<bool>(nullable: false),
                    DoiTuong = table.Column<int>(nullable: true),
                    DoiTuongTHCP = table.Column<int>(nullable: true),
                    DonDatHang = table.Column<int>(nullable: true),
                    HopDongMua = table.Column<int>(nullable: true),
                    DonVi = table.Column<int>(nullable: true),
                    CoTaiKhoanNganHang = table.Column<bool>(nullable: false),
                    CongTrinh = table.Column<int>(nullable: true),
                    HopDongBan = table.Column<int>(nullable: true),
                    KhoanMucCP = table.Column<int>(nullable: true),
                    MaThongKe = table.Column<int>(nullable: true),
                    Grade = table.Column<int>(nullable: false),
                    TotalChild = table.Column<int>(nullable: false),
                    IsParent = table.Column<bool>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    ParentId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DM_TaiKhoan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DM_TaiKhoan_DM_TaiKhoan_ParentId",
                        column: x => x.ParentId,
                        principalTable: "DM_TaiKhoan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DM_TaiKhoan_ParentId",
                table: "DM_TaiKhoan",
                column: "ParentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DM_TaiKhoan");
        }
    }
}
