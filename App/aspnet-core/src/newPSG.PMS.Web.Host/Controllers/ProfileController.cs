using Abp.AspNetCore.Mvc.Authorization;
using newPSG.PMS.Storage;

namespace newPSG.PMS.Web.Controllers
{
    [AbpMvcAuthorize]
    public class ProfileController : ProfileControllerBase
    {
        public ProfileController(ITempFileCacheManager tempFileCacheManager) :
            base(tempFileCacheManager)
        {
        }
    }
}