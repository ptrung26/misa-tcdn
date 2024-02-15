using Abp.Application.Services.Dto;
using System;

namespace newPSG.PMS.FireBaseServer.Dtos
{
    public class GetAllUserFireBaseTokensInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }



    }
}