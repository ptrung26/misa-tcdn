using System.Threading.Tasks;
using Abp.Application.Services;

namespace newPSG.PMS.MultiTenancy
{
    public interface ISubscriptionAppService : IApplicationService
    {
        Task DisableRecurringPayments();

        Task EnableRecurringPayments();
    }
}
