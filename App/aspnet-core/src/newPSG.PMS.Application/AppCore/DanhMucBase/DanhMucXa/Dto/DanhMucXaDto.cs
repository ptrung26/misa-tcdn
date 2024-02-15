using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newPSG.PMS.Entities;

namespace newPSG.PMS.DanhMucXa.Dto
{
    [AutoMap(typeof(DanhMucXaEntity))]
    public class DanhMucXaDto : EntityDto<int>
    {
        public string MaXa { get; set; }
        public string TenXa { get; set; }
        public string MaTinh { get; set; }
        public string TenTinh { get; set; }
        public string MaHuyen { get; set; }
        public string TenHuyen { get; set; }
        public string Cap { get; set; }
    }
}
