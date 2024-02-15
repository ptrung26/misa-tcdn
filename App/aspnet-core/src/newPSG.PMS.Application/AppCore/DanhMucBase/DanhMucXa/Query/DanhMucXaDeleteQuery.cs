using Abp.Domain.Repositories;
using Abp.Runtime.Caching;
using MediatR;
using newPSG.PMS.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucXa.HandlerQuery
{
    public class DanhMucXaDeleteQuery : IRequest
    {
        public  int Id { get; set; }

    }
    public class DeleteQueryHandler : IRequestHandler<DanhMucXaDeleteQuery>
    {
        private readonly IRepository<DanhMucXaEntity> _xaRepos;
        private readonly ICache _cache;
        public DeleteQueryHandler(IRepository<DanhMucXaEntity> xaRepos,
            ICacheManager cache)
        {
            _cache = cache.GetCache("DanhMucXa");
            _xaRepos = xaRepos;
        }
        public async Task<Unit> Handle(DanhMucXaDeleteQuery input, CancellationToken cancellationToken)
        {
            await _xaRepos.DeleteAsync(input.Id);
            await _cache.ClearAsync();
            return await Task.FromResult(Unit.Value);
        }
    }
}
