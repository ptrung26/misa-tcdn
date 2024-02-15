using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Runtime.Caching;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucHuyenManagement.Business
{
    public class DanhMucHuyenGetComboBoxDataRequest : IRequest<IEnumerable<ComboboxItemDto>>
    {
        public string MaTinh { get; set; }
    }

    public class GetComboBoxDataMediatorRequestHandler : IRequestHandler<DanhMucHuyenGetComboBoxDataRequest, IEnumerable<ComboboxItemDto>>
    {
        private readonly ICacheManager _cache;
        private readonly IRepository<DanhMucHuyenEntity, int> _repos;

        public GetComboBoxDataMediatorRequestHandler(ICacheManager cache, IRepository<DanhMucHuyenEntity, int> repos)
        {
            _cache = cache;
            _repos = repos;
        }

        public async Task<IEnumerable<ComboboxItemDto>> Handle(DanhMucHuyenGetComboBoxDataRequest request, CancellationToken cancellationToken)
        {
            var query = _repos.GetAll().Where(x => x.MaTinh == request.MaTinh).OrderBy(x => x.TenHuyen)
                .Select(x => new ComboboxItemDto
                {
                    Value = x.MaHuyen,
                    DisplayText = x.TenHuyen,
                });
            var data = await query.ToListAsync(cancellationToken);
            return data;
        }
    }
}