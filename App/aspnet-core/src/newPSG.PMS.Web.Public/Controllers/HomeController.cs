using Microsoft.AspNetCore.Mvc;
using newPSG.PMS.Web.Controllers;

namespace newPSG.PMS.Web.Public.Controllers
{
    public class HomeController : PMSControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}