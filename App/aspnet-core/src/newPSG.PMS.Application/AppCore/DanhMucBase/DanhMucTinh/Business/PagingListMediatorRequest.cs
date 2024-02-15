using Abp.Application.Services.Dto;
using Abp.Linq.Extensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.DanhMucTinh.Dto;
using newPSG.PMS.Dto;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Abp.AutoMapper;

namespace newPSG.PMS.DanhMucTinhManagement.Business
{
    public class DanhMucTinhPagingListMediatorRequest: PagedFullInputDto, IRequest<PagedResultDto<DanhMucTinhDto>>
    {
    }

    public class PagingListMediatorRequestHandler : AppBusinessBase, IRequestHandler<DanhMucTinhPagingListMediatorRequest,PagedResultDto<DanhMucTinhDto>>
    {
       

        [System.Obsolete]
        public async Task<PagedResultDto<DanhMucTinhDto>> Handle(DanhMucTinhPagingListMediatorRequest input, CancellationToken cancellationToken)
        {
            input.Format();
            var query = TinhRepository.GetAll()
                .WhereIf(!string.IsNullOrEmpty(input.Filter),
                    x => EF.Functions.Like(x.TenTinh,input.FilterFullText)
                || x.MaTinh == input.Filter
                );
            var count = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input).ToListAsync(cancellationToken);
            var listDtos = items.MapTo<List<DanhMucTinhDto>>();
            return new PagedResultDto<DanhMucTinhDto>(
                count,
                listDtos
            );
        }
    }
}
