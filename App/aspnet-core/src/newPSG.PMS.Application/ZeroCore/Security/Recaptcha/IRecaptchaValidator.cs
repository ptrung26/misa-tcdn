using System.Threading.Tasks;

namespace newPSG.PMS.Security.Recaptcha
{
    public interface IRecaptchaValidator
    {
        Task ValidateAsync(string captchaResponse);
    }
}