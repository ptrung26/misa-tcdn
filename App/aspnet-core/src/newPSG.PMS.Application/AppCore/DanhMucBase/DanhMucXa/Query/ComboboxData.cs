using Abp.Application.Services.Dto;
using MediatR;
using newPSG.PMS.Entities;
using newPSG.PMS.Helper;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucXa.HandlerQuery
{
    public class DanhMucXaGetComboBoxDataQuery : IRequest<IEnumerable<ComboboxItemDto>>
    {
        public string MaHuyen { get; set; }
    }
    public class GetComboBoxDataQueryHandler : IRequestHandler<DanhMucXaGetComboBoxDataQuery, IEnumerable<ComboboxItemDto>>
    {
        private readonly IApplicationServiceFactory _factory;
        public GetComboBoxDataQueryHandler(IApplicationServiceFactory factory)
        {
            _factory = factory;
        }
        public async Task<IEnumerable<ComboboxItemDto>> Handle(DanhMucXaGetComboBoxDataQuery request, CancellationToken cancellationToken)
        {
            var keyCache = $"ComboBox_{request.MaHuyen}";
            var cache = _factory.CacheManager.GetCache("DanhMucXa");
            var dataCache = await cache.GetOrDefaultAsync(keyCache);
            if (dataCache != null)
            {
                return dataCache as IEnumerable<ComboboxItemDto>;
            }
            var xaRepos = _factory.UnitOfWorkDapper.DapperRepository<DanhMucXaEntity>();
            var data = await xaRepos
                .SetSelect(x => new
                {
                    x.MaXa,
                    x.TenXa
                })
                .FindAllAsync(x=>x.MaHuyen == request.MaHuyen && x.IsDeleted == false);
            var listDto = data.Select(x => new ComboboxItemDto()
            {
                Value = x.MaXa,
                DisplayText = x.TenXa
            }).OrderBy(x => x.DisplayText).ToList() ;

            await cache.SetAsync(keyCache, listDto);
            return listDto;
        }
    }
}
