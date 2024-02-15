using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using MediatR;
using newPSG.PMS.DanhMucHuyenManagement.Business;
using newPSG.PMS.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTaiKhoanManagement.Bussiness
{
    public class DanhMucTaiKhoanDeleteRequest : EntityDto, IRequest
    {
    }

    public class DanhMucTaiKhoanDeleteHandler : IRequestHandler<DanhMucHuyenDeleteRequest>
    {
        private readonly IRepository<DanhMucTaiKhoanEntity> _tkRepos;

        public DanhMucTaiKhoanDeleteHandler(IRepository<DanhMucTaiKhoanEntity> tkRepos)
        {
            _tkRepos = tkRepos;
        }

        public async Task<Unit> Handle(DanhMucHuyenDeleteRequest request, CancellationToken cancellationToken)
        {
            await _tkRepos.DeleteAsync(request.Id);
            return await Task.FromResult(Unit.Value);
        }
    }
}
