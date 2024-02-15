namespace newPSG.PMS.Authorization.Accounts.Dto
{
    public class RegisterOutput
    {
        public bool CanLogin { get; set; }
        public bool? IsConfirmEmail { get; set; }
    }
}