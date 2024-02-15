using System.ComponentModel.DataAnnotations;

namespace newPSG.PMS.Authorization.Accounts.Dto
{
    public class SendEmailActivationLinkInput
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}