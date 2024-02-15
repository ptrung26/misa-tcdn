using Abp.AutoMapper;
using newPSG.PMS.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace newPSG.PMS.Dto
{
    [AutoMap(typeof(DanhMucTaiKhoanEntity))]
    public class DanhMucTaiKhoanDto
    {
        public int Id { get; set; }
        public string SoTaiKhoan { get; set; }

        public string TenTaiKhoan { get; set; }

        public string TenTiengAnh { get; set; }


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

        public int Grade { get; set; }

        public bool IsParent { get; set; }

        public bool IsActive { get; set; }

        public virtual DanhMucTaiKhoanEntity Parent { get; set; }

    }
}
