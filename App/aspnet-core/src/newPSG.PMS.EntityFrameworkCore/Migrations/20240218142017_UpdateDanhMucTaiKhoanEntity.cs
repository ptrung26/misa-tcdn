using Microsoft.EntityFrameworkCore.Migrations;

namespace newPSG.PMS.Migrations
{
    public partial class UpdateDanhMucTaiKhoanEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TenTiengAnh",
                table: "DM_TaiKhoan",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext CHARACTER SET utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TenTiengAnh",
                table: "DM_TaiKhoan",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
