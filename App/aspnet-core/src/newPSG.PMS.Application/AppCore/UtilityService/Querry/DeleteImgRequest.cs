using Abp.Domain.Repositories;
using MediatR;
using newPSG.PMS.Storage;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.UtilityService.Business
{
    public class DeleteImgRequest : IRequest
    {
        public Guid ImgId { get; set; }
    }

    public class DeleteImgHandler : IRequestHandler<DeleteImgRequest>
    {
        private readonly IRepository<BinaryObject, Guid> _imgRepos;

        public DeleteImgHandler(
            IRepository<BinaryObject, Guid> imgRepos)
        {
            _imgRepos = imgRepos;
        }

        public async Task<Unit> Handle(DeleteImgRequest request, CancellationToken cancellationToken)
        {
            await _imgRepos.DeleteAsync(request.ImgId);
            return await Task.FromResult(Unit.Value);
        }
    }
}