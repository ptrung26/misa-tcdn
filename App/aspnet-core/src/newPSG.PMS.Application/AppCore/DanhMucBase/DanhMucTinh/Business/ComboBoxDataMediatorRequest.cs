using Abp.Application.Services.Dto;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTinhManagement.Business
{
    public class DanhMucTinhComboBoxDataMediatorRequest:IRequest<IEnumerable<ComboboxItemDto>>
    {
    }

    public class ComboBoxDataQueryHandler : AppBusinessBase, IRequestHandler<DanhMucTinhComboBoxDataMediatorRequest,IEnumerable<ComboboxItemDto>>
    {
        private readonly string _keyCache = "DanhMucTinhAppService";

        public async Task<IEnumerable<ComboboxItemDto>> Handle(DanhMucTinhComboBoxDataMediatorRequest mediatorRequest, CancellationToken cancellationToken)
        {
            var cache = CacheManager.GetCache(_keyCache);
            var dataCache = await cache.GetOrDefaultAsync("ComboBox");
            if (dataCache != null)
            {
                return dataCache as IEnumerable<ComboboxItemDto>;
            }
            var sql = $@"select MaTinh Value, TenTinh DisplayText 
            from danh_muc_tinh tinh
            WHERE IsDeleted = @isDelete
            order by tinh.TenTinh";

            var data = await Dapper.QueryAsync<ComboboxItemDto>(sql,
                new
                {
                    isDelete = 0
                });
            await cache.SetAsync("ComboBox", data);
            return data;
        }
    }
}
