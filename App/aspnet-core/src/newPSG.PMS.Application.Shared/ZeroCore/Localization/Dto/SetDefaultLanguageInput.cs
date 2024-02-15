﻿using System.ComponentModel.DataAnnotations;
using Abp.Localization;

namespace newPSG.PMS.Localization.Dto
{
    public class SetDefaultLanguageInput
    {
        [Required]
        [StringLength(ApplicationLanguage.MaxNameLength)]
        public virtual string Name { get; set; }
    }
}