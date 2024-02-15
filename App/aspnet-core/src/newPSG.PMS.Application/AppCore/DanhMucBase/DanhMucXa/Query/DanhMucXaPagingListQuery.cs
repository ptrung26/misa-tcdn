using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.DanhMucXa.Dto;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;
using newPSG.PMS.Helper;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucXa.HandlerQuery
{
    public class DanhMucXaPagingListQuery : PagedFullInputDto, IRequest<PagedResultDto<DanhMucXaDto>>
    {
        public string MaTinh { get; set; }
        public string MaHuyen { get; set; }
    }

    public class PagingListQueryHandler : IRequestHandler<DanhMucXaPagingListQuery, PagedResultDto<DanhMucXaDto>>
    {
        private readonly IRepository<DanhMucXaEntity> _xaRepos;
        private readonly IMapper _mapper;

        public PagingListQueryHandler(IRepository<DanhMucXaEntity> xaRepos,
            IMapper mapper, IApplicationServiceFactory factory)
        {
            _mapper = mapper;
            _xaRepos = xaRepos;
        }

        public async Task<PagedResultDto<DanhMucXaDto>> Handle(DanhMucXaPagingListQuery input, CancellationToken cancellationToken)
        {
            input.Format();
            var query = _xaRepos.GetAll()
                .WhereIf(!string.IsNullOrEmpty(input.Filter),
                    x => EF.Functions.Like(x.TenXa, input.FilterFullText)
                         || x.MaXa == input.Filter)
                .WhereIf(!string.IsNullOrEmpty(input.MaTinh), x => x.MaTinh == input.MaTinh)
                .WhereIf(!string.IsNullOrEmpty(input.MaHuyen), x => x.MaHuyen == input.MaHuyen);
            var count = await query.CountAsync(cancellationToken: cancellationToken);
            var items = await query.OrderBy(input.Sorting ?? "id asc").PageBy(input).ToListAsync(cancellationToken);
            var listDtos = items.MapTo<List<DanhMucXaDto>>();
            return new PagedResultDto<DanhMucXaDto>(
                count,
                listDtos
            );
        }
    }
}