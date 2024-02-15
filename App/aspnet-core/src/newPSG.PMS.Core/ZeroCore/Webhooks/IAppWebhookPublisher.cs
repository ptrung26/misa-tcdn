using System.Threading.Tasks;
using newPSG.PMS.Authorization.Users;

namespace newPSG.PMS.WebHooks
{
    public interface IAppWebhookPublisher
    {
        Task PublishTestWebhook();
    }
}
