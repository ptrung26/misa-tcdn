using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;

namespace newPSG.PMS.AppCore.DanhMucBase.DanhMucQuocTich.Dto
{
    [AutoMap(typeof(DanhMucQuocTichEntity))]
    public class DanhMucQuocTichDto : EntityDto<int>
    {
        public string Name { get; set; }
        public string Alpha2Code { get; set; }
        public string Alpha3Code { get; set; }
        public int NumericCode { get; set; }
        public bool IsActive { get; set; }
    }

    public class PagingListDanhMucQuocTichInput : PagedAndSortedInputDto
    {
        public string Filter { get; set; }
    }
}