using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using static newPSG.CommonEnum;
namespace newPSG.PMS.Dto
{
    public class DanhMucTaiKhoanExportDto
    {
        public int Id { get; set; }
        public string SoTaiKhoan { get; set; }

        public string TenTaiKhoan { get; set; }

        public int? TinhChat { get; set; }
        public string TenTinhChat
        {
            get
            {
                return TinhChat.HasValue ? GetEnumDescription((TINH_CHAT_TAI_KHOAN)TinhChat) : null;
            }
        }

        public string TenTiengAnh { get; set; }

        public string DienGiai { get; set; }

        public int? TrangThai { get; set; }
        public string TenTrangThai
        {
            get
            {
                return TrangThai.HasValue ? GetEnumDescription((TRANG_THAI_TAI_KHOAN)TrangThai) : null;
            }
        }
    }
}
