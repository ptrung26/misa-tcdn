using Abp.Authorization;
using Abp.Runtime.Caching;
using MediatR;
using newPSG.PMS.UtilityService.Business;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace newPSG.PMS.UtilityService
{
    public interface IUtilityAppService
    {
        Task<Guid> UploadImg(string fileToken);

        Task DeleteImg(Guid ImgId);

        Task DeleteListImg(List<Guid> listImgId);

        Task<Guid?> CopyImg(Guid ImgId);
    }

    [AbpAuthorize]
    public class UtilityAppService : PMSAppServiceBase, IUtilityAppService
    {
        private readonly IMediator _mediator;
        private readonly ICacheManager _cacheManager;

        public UtilityAppService(IMediator mediator, ICacheManager cacheManager)
        {
            _mediator = mediator;
            _cacheManager = cacheManager;
        }

        public async Task<Guid> UploadImg(string fileToken)
        {
            return await _mediator.Send(new UploadImgRequest
            {
                FileToken = fileToken
            });
        }

        public async Task<Guid?> CopyImg(Guid ImgId)
        {
            return await _mediator.Send(new CopyImgRequest
            {
                ImgId = ImgId
            });
        }

        public async Task DeleteImg(Guid ImgId)
        {
            await _mediator.Send(new DeleteImgRequest
            {
                ImgId = ImgId
            });
        }

        public async Task DeleteListImg(List<Guid> listImgId)
        {
            await _mediator.Send(new DeleteListImgRequest
            {
                ImgIds = listImgId
            });
        }
    }
}