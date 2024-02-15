using Abp.Domain.Repositories;
using MediatR;
using newPSG.PMS.Storage;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.UtilityService.Business
{
    public class DeleteListImgRequest : IRequest
    {
        public List<Guid> ImgIds { get; set; }
    }

    public class DeleteListImgHandler : IRequestHandler<DeleteListImgRequest>
    {
        private readonly IRepository<BinaryObject, Guid> _imgRepos;

        public DeleteListImgHandler(
            IRepository<BinaryObject, Guid> imgRepos)
        {
            _imgRepos = imgRepos;
        }

        public async Task<Unit> Handle(DeleteListImgRequest request, CancellationToken cancellationToken)
        {
            await _imgRepos.DeleteAsync(x => request.ImgIds.Contains(x.Id));
            return await Task.FromResult(Unit.Value);
        }
    }
}