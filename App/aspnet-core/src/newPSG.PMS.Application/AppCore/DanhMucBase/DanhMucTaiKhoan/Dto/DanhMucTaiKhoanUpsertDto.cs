using Abp.AutoMapper;
using newPSG.PMS.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace newPSG.PMS.Dto
{
    [AutoMapTo(typeof(DanhMucTaiKhoanEntity))]
    public class DanhMucTaiKhoanUpsertDto
    {
        public int? Id { get; set; }

        [Required]
        public string SoTaiKhoan { get; set; }

        [Required]
        [MaxLength(100)]
        public string TenTaiKhoan { get; set; }

        [Required]
        public string TenTiengAnh { get; set; }

        [Required]
        public int TinhChat { get; set; }

        public string DienGiai { get; set; }

        public bool CoHachToanNgoaiTe { get; set; }

        public int? DoiTuong { get; set; }

        /// <summary>
        /// Đối tượng tập hợp chi phí 
        /// </summary>
        public int? DoiTuongTHCP { get; set; }

        public int? DonDatHang { get; set; }

        public int? HopDongMua { get; set; }

        public int? DonVi { get; set; }

        public bool CoTaiKhoanNganHang { get; set; }

        public int? CongTrinh { get; set; }

        public int? HopDongBan { get; set; }

        /// <summary>
        /// Khoản mục chi phí
        /// </summary>
        public int? KhoanMucCP { get; set; }
        public int? MaThongKe { get; set; }

        public bool IsActive { get; set; }

        public int TotalChild { get; set; }

        public int? ParentId { get; set; }
    }
}
