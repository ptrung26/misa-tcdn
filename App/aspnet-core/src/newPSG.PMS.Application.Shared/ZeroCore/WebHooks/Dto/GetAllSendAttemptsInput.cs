using newPSG.PMS.Dto;

namespace newPSG.PMS.WebHooks.Dto
{
    public class GetAllSendAttemptsInput : PagedInputDto
    {
        public string SubscriptionId { get; set; }
    }
}
