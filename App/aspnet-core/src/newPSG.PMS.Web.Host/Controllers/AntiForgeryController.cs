using Microsoft.AspNetCore.Antiforgery;

namespace newPSG.PMS.Web.Controllers
{
    public class AntiForgeryController : PMSControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}
