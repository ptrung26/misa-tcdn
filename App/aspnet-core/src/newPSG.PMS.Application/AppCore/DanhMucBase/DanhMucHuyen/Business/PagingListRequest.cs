using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucHuyenManagement.Business
{
    public class DanhMucHuyenPagingListRequest : PagedFullInputDto, IRequest<PagedResultDto<DanhMucHuyenDto>>
    {
        public string MaTinh { get; set; }
    }

    public class PagingListRequestHandler : IRequestHandler<DanhMucHuyenPagingListRequest, PagedResultDto<DanhMucHuyenDto>>
    {
        private readonly IRepository<DanhMucHuyenEntity> _repos;

        public PagingListRequestHandler(IRepository<DanhMucHuyenEntity> repos)
        {
            _repos = repos;
        }

        [Obsolete]
        public async Task<PagedResultDto<DanhMucHuyenDto>> Handle(DanhMucHuyenPagingListRequest input, CancellationToken cancellationToken)
        {
            input.Format();
            var query = (from huyen in _repos.GetAll()
                    select new DanhMucHuyenDto
                    {
                        Id = huyen.Id,
                        TenHuyen = huyen.TenHuyen,
                        MaHuyen = huyen.MaHuyen,
                        MaTinh = huyen.MaTinh,
                        TenTinh = huyen.TenTinh,
                        Cap = huyen.Cap,
                    })
                .WhereIf(!string.IsNullOrEmpty(input.Filter), 
                    u => EF.Functions.Like(u.TenHuyen,input.FilterFullText)
                                                                   || u.MaHuyen == input.Filter)
                .WhereIf(!string.IsNullOrEmpty(input.MaTinh), 
                    u => u.MaTinh == input.MaTinh);


            var huyenCount = await query.CountAsync(cancellationToken);
            var dataGrids = await query
                .OrderBy(input.Sorting ?? "id asc")
                .PageBy(input)
                .ToListAsync(cancellationToken);
            return new PagedResultDto<DanhMucHuyenDto>(huyenCount, dataGrids);
        }
    }
}
