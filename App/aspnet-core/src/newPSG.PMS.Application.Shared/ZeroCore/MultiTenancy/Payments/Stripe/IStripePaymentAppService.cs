using System.Threading.Tasks;
using Abp.Application.Services;
using newPSG.PMS.MultiTenancy.Payments.Dto;
using newPSG.PMS.MultiTenancy.Payments.Stripe.Dto;

namespace newPSG.PMS.MultiTenancy.Payments.Stripe
{
    public interface IStripePaymentAppService : IApplicationService
    {
        Task ConfirmPayment(StripeConfirmPaymentInput input);

        StripeConfigurationDto GetConfiguration();

        Task<SubscriptionPaymentDto> GetPaymentAsync(StripeGetPaymentInput input);

        Task<string> CreatePaymentSession(StripeCreatePaymentSessionInput input);
    }
}