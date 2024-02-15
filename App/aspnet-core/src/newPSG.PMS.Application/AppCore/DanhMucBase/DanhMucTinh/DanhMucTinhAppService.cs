using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using newPSG.PMS.DanhMucTinh.Dto;
using newPSG.PMS.DanhMucTinhManagement.Business;
using newPSG.PMS.Helper;
using SqlKata.Compilers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTinhManagement
{
    //[AbpAuthorize]
    public class DanhMucTinhAppService : PMSAppServiceBase, IDanhMucTinhAppService
    {
        private readonly IApplicationServiceFactory _factory;

        private readonly IMediator _mediator;

        public DanhMucTinhAppService(IMediator mediator,
            IApplicationServiceFactory factory)
        {
            _mediator = mediator;
            _factory = factory;
        }

        [HttpGet]
        public async Task<IEnumerable<ComboboxItemDto>> ComboBoxData()
        {
            return await _mediator.Send(new DanhMucTinhComboBoxDataMediatorRequest());
        }

        [HttpPost]
        public async Task<PagedResultDto<DanhMucTinhDto>> PagingList(DanhMucTinhPagingListMediatorRequest input)
        {
            return await _mediator.Send(input);
        }

        [HttpPost]
        public async Task<int> InsertOrUpdate(DanhMucTinhUpsertMediatorRequest input)
        {
            return await _mediator.Send(input);
        }

        [HttpDelete]
        public async Task Delete(int id)
        {
            await _mediator.Send(new DanhMucTinhDeleteMediatorRequest
            {
                Id = id
            });
        }
    }
}