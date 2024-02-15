using Abp.AutoMapper;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;

namespace newPSG.PMS.Dto
{
    [AutoMap(typeof(DanhMucHuyenEntity))]
    public class DanhMucHuyenDto
    {
        public int? Id { get; set; }
        public string MaHuyen { get; set; }
        public string TenHuyen { get; set; }
        public string MaTinh { get; set; }
        public string TenTinh { get; set; }
        public string Cap { get; set; }
    }
}
