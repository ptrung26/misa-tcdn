using System.ComponentModel.DataAnnotations;

namespace newPSG.PMS.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
