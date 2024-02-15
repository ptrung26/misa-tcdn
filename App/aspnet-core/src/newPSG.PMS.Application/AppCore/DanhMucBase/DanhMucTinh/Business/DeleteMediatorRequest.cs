using Abp.Domain.Repositories;
using Abp.Runtime.Caching;
using MediatR;
using newPSG.PMS.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTinhManagement.Business
{
    public class DanhMucTinhDeleteMediatorRequest : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteMediatorRequestHandler : IRequestHandler<DanhMucTinhDeleteMediatorRequest>
    {
        private readonly IRepository<DanhMucTinhEntity, int> _repository;
        private readonly ICacheManager _cache;

        public DeleteMediatorRequestHandler(IRepository<DanhMucTinhEntity, int> repository, ICacheManager cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<Unit> Handle(DanhMucTinhDeleteMediatorRequest request, CancellationToken cancellationToken)
        {
            await _repository.DeleteAsync(request.Id);
            await _cache.GetCache("DanhMucTinhAppService").ClearAsync();
            return await Task.FromResult(Unit.Value);
        }
    }
}