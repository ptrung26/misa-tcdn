using Abp.Application.Services.Dto;
using Abp.UI;
using MediatR;
using newPSG.PMS.DanhMucHuyenManagement.Business;
using newPSG.PMS.DanhMucTaiKhoanManagement.Bussiness;
using newPSG.PMS.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTaiKhoanManagement
{
    public class DanhMucTaiKhoanAppService : PMSAppServiceBase, IDanhMucTaiKhoanAppService
    {
        private readonly IMediator _mediator;
        public DanhMucTaiKhoanAppService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Delete(DanhMucTaiKhoanDeleteRequest request)
        {
            await _mediator.Send(request);
        }

        public async Task<int> InsertOrUpdate(DanhMucTaiKhoanUpsertRequest request)
        {
            var result = await _mediator.Send(request);
            return result;
        }

        public async Task<PagedResultDto<DanhMucTaiKhoanDto>> PagingListRequest(DanhMucTaiKhoanPagingListRequest request)
        {
            var result = await _mediator.Send(request);
            return result;

        }

        public async Task<FileDto> ExportToExcelRequest(ExportDanhMucTaiKhoanRequest request)
        {
            var result = await _mediator.Send(request);
            return result;
        }

        public async Task<bool> IsSoTaiKhoanExist(CheckValidSoTaiKhoanRequest request)
        {
            var result = await _mediator.Send(request);
            return result;
        }
    }
}
