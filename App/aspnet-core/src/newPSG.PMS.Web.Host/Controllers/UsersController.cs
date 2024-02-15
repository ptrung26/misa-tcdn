using Abp.AspNetCore.Mvc.Authorization;
using newPSG.PMS.Authorization;
using newPSG.PMS.Storage;
using Abp.BackgroundJobs;

namespace newPSG.PMS.Web.Controllers
{
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
    public class UsersController : UsersControllerBase
    {
        public UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager)
            : base(binaryObjectManager, backgroundJobManager)
        {
        }
    }
}