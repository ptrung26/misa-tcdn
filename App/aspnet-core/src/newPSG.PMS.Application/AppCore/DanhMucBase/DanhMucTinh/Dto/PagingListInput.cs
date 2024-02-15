using newPSG.PMS.Dto;

namespace newPSG.PMS.DanhMucTinh.Dto
{
    public class PagingListDanhMucTinhInput: PagedAndSortedInputDto
    {
        public string Filter { get; set; }
    }
}
