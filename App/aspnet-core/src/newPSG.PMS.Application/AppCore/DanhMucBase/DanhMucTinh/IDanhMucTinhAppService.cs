using Abp.Application.Services;
using Abp.Application.Services.Dto;
using newPSG.PMS.DanhMucTinh.Dto;
using newPSG.PMS.DanhMucTinhManagement.Business;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTinhManagement
{
    public interface IDanhMucTinhAppService : IApplicationService
    {
        Task<IEnumerable<ComboboxItemDto>> ComboBoxData();
        Task<PagedResultDto<DanhMucTinhDto>> PagingList(DanhMucTinhPagingListMediatorRequest input);
        Task<int> InsertOrUpdate(DanhMucTinhUpsertMediatorRequest input);
        Task Delete(int id);
    }
}
