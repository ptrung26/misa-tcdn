using System.Threading.Tasks;
using Abp.Application.Services;
using newPSG.PMS.MultiTenancy.Payments.PayPal.Dto;

namespace newPSG.PMS.MultiTenancy.Payments.PayPal
{
    public interface IPayPalPaymentAppService : IApplicationService
    {
        Task ConfirmPayment(long paymentId, string paypalOrderId);

        PayPalConfigurationDto GetConfiguration();
    }
}
