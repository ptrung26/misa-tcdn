using Abp.Application.Services.Dto;
using MediatR;
using newPSG.PMS.DanhMucHuyenManagement.Business;
using newPSG.PMS.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucHuyenManagement
{
    #region MAIN
    public class DanhMucHuyenAppService : PMSAppServiceBase
    {
        private readonly IMediator _mediator;
        public DanhMucHuyenAppService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<PagedResultDto<DanhMucHuyenDto>> SearchServerPaging(DanhMucHuyenPagingListRequest input)
        {
            return await _mediator.Send(input);
        }

        public async Task<int> CreateOrUpdate(DanhMucHuyenUpsertRequest input)
        {
            return await _mediator.Send(input);
        }

        public async Task Delete(DanhMucHuyenDeleteRequest input)
        {
             await _mediator.Send(input);
        }
        public async Task<DanhMucHuyenDto> GetById(DanhMucHuyenGetByIdRequest input)
        {
            return await _mediator.Send(input);
        }


        public async Task<IEnumerable<ComboboxItemDto>> ComboBoxData(string maTinh)
        {
            var req = new DanhMucHuyenGetComboBoxDataRequest
            {
                MaTinh = maTinh
            };
            return await _mediator.Send(req);
        }

    }
    #endregion
}
