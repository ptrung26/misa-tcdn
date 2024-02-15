using System.Collections.Generic;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using System.Threading.Tasks;
using newPSG.PMS.DanhMucXa.Dto;
using newPSG.PMS.DanhMucXa.HandlerQuery;

namespace newPSG.PMS.DanhMucXa
{
    public interface IDanhMucXaAppService : IApplicationService
    {
        Task<IEnumerable<ComboboxItemDto>> GetComboBoxData(string maHuyen);
        Task<PagedResultDto<DanhMucXaDto>> PagingList(DanhMucXaPagingListQuery input);
        Task InsertOrUpdate(DanhMucXaInsertOrUpdateQuery input);
        Task Delete(int id);
    }
}
