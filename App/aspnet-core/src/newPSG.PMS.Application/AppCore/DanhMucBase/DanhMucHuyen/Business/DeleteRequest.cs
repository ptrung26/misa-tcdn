using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using MediatR;
using newPSG.PMS.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucHuyenManagement.Business
{
    public class DanhMucHuyenDeleteRequest : EntityDto, IRequest
    {
    }

    public class DeleteRequestHandler : IRequestHandler<DanhMucHuyenDeleteRequest>
    {
        private readonly IRepository<DanhMucHuyenEntity, int> _repos;

        public DeleteRequestHandler(IRepository<DanhMucHuyenEntity, int> repos)
        {
            _repos = repos;
        }

        public async Task<Unit> Handle(DanhMucHuyenDeleteRequest request, CancellationToken cancellationToken)
        {
            await _repos.DeleteAsync(request.Id);
            return await Task.FromResult(Unit.Value);
        }
    }
}