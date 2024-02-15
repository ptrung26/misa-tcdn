using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Runtime.Caching;
using MediatR;
using newPSG.PMS.DanhMucTinh.Dto;
using newPSG.PMS.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTinhManagement.Business
{
    public class DanhMucTinhUpsertMediatorRequest : DanhMucTinhDto, IRequest<int>
    {
    }

    public class UpsertMediatorRequestHandler : IRequestHandler<DanhMucTinhUpsertMediatorRequest, int>
    {
        private readonly IRepository<DanhMucTinhEntity, int> _repository;
        private readonly ICacheManager _cache;

        public UpsertMediatorRequestHandler(IRepository<DanhMucTinhEntity, int> repository, ICacheManager cache)
        {
            _repository = repository;
            _cache = cache;
        }

        [System.Obsolete]
        public async Task<int> Handle(DanhMucTinhUpsertMediatorRequest input, CancellationToken cancellationToken)
        {
            await _cache.GetCache("DanhMucTinhAppService").ClearAsync();
            if (input.Id > 0)
            {
                var @update = await _repository.GetAsync(input.Id);
                input.MapTo(@update);
                await _repository.UpdateAsync(@update);
                return @update.Id;
            }

            var @insert = input.MapTo<DanhMucTinhEntity>();
            return await _repository.InsertAndGetIdAsync(@insert);
        }
    }
}