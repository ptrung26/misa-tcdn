using Abp.Domain.Repositories;
using MediatR;
using newPSG.PMS.Storage;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.UtilityService.Business
{
    public class CopyImgRequest : IRequest<Guid?>
    {
        [Required]
        public Guid ImgId { get; set; }
    }

    public class CopyImgHandler : IRequestHandler<CopyImgRequest, Guid?>
    {
        private const int MaxProfilPictureBytes = 5242880; //5MB
        private readonly IRepository<BinaryObject, Guid> _imgRepos;
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public CopyImgHandler(
            IRepository<BinaryObject, Guid> imgRepos,
            ITempFileCacheManager tempFileCacheManager)
        {
            _imgRepos = imgRepos;
            _tempFileCacheManager = tempFileCacheManager;
        }

        public async Task<Guid?> Handle(CopyImgRequest request, CancellationToken cancellationToken)
        {
            var oldImg = await _imgRepos.FirstOrDefaultAsync(x => x.Id == request.ImgId);
            if (oldImg == null)
            {
                return null;
            }
            else
            {
                var imgEntity = new BinaryObject
                {
                    Bytes = oldImg.Bytes,
                    Id = Guid.NewGuid()
                };
                await _imgRepos.InsertAsync(imgEntity);
                return imgEntity.Id;
            }
        }
    }
}