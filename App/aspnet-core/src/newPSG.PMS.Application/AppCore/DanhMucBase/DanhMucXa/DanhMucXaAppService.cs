using Abp.Application.Services.Dto;
using Abp.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using newPSG.PMS.DanhMucXa.Dto;
using newPSG.PMS.DanhMucXa.HandlerQuery;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucXa
{
    [AbpAuthorize]
    public class DanhMucXaAppService : PMSAppServiceBase, IDanhMucXaAppService
    {
        private readonly IMediator _mediator;
        public DanhMucXaAppService(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException();
        }
        [HttpGet]
        public async Task<IEnumerable<ComboboxItemDto>> GetComboBoxData(string maHuyen)
        {
            var query = new DanhMucXaGetComboBoxDataQuery(){MaHuyen = maHuyen};
            return await _mediator.Send(query);
        }
        [HttpPost]
        public async Task<PagedResultDto<DanhMucXaDto>> PagingList(DanhMucXaPagingListQuery input)
        {
            return await _mediator.Send(input);
        }

        [HttpPost]
        public async Task InsertOrUpdate(DanhMucXaInsertOrUpdateQuery input)
        {
            await _mediator.Send(input);
        }

        [HttpDelete]
        public async Task Delete(int id)
        {
            await _mediator.Send(new DanhMucXaDeleteQuery
            {
                Id =  id
            });
        }

    }
}
