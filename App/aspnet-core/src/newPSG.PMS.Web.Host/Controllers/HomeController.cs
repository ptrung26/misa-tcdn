using Abp.Auditing;
using Microsoft.AspNetCore.Mvc;

namespace newPSG.PMS.Web.Controllers
{
    public class HomeController : PMSControllerBase
    {
        [DisableAuditing]
        public IActionResult Index()
        {
            return RedirectToAction("Index", "Ui");
        }
    }
}
