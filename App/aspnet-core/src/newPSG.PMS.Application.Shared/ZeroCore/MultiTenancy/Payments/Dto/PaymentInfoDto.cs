using newPSG.PMS.Editions.Dto;

namespace newPSG.PMS.MultiTenancy.Payments.Dto
{
    public class PaymentInfoDto
    {
        public EditionSelectDto Edition { get; set; }

        public decimal AdditionalPrice { get; set; }

        public bool IsLessThanMinimumUpgradePaymentAmount()
        {
            return AdditionalPrice < PMSConsts.MinimumUpgradePaymentAmount;
        }
    }
}
