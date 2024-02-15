using System.Threading.Tasks;
using newPSG.PMS.Security.Recaptcha;

namespace newPSG.PMS.Test.Base.Web
{
    public class FakeRecaptchaValidator : IRecaptchaValidator
    {
        public Task ValidateAsync(string captchaResponse)
        {
            return Task.CompletedTask;
        }
    }
}
