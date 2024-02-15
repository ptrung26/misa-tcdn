using System.Threading.Tasks;
using Abp.Webhooks;

namespace newPSG.PMS.WebHooks
{
    public interface IWebhookEventAppService
    {
        Task<WebhookEvent> Get(string id);
    }
}
