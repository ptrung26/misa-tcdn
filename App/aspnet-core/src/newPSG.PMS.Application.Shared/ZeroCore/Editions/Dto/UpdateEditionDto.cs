﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace newPSG.PMS.Editions.Dto
{
    public class UpdateEditionDto
    {
        [Required]
        public EditionEditDto Edition { get; set; }

        [Required]
        public List<NameValueDto> FeatureValues { get; set; }
    }
}