using Abp.Application.Services.Dto;
using MediatR;
using newPSG.PMS.DanhMucHuyenManagement.Business;
using newPSG.PMS.DanhMucTaiKhoanManagement.Bussiness;
using newPSG.PMS.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTaiKhoanManagement.Bussiness
{
    public interface IDanhMucTaiKhoanAppService
    {
        Task<PagedResultDto<DanhMucTaiKhoanDto>> PagingListRequest(DanhMucTaiKhoanPagingListRequest request);
        Task<int> InsertOrUpdate(DanhMucTaiKhoanUpsertRequest request);
        Task Delete(DanhMucTaiKhoanDeleteRequest request);
    }
}
