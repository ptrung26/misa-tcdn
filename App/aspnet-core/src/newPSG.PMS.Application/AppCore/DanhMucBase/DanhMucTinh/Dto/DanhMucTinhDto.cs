using Abp.Application.Services.Dto;
using Abp.Domain.Entities;

namespace newPSG.PMS.DanhMucTinh.Dto
{
    public class DanhMucTinhDto: EntityDto<int>
    {
        public string MaTinh { get; set; }
        public string TenTinh { get; set; }
        public string Cap { get; set; }
    }
}
