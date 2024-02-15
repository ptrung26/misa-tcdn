
using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace newPSG.PMS.FireBaseServer.Dtos
{
    public class UserFireBaseTokenInput 
    {
		public string FireBaseToken { get; set; }	
		//public long UserId { get; set; }
    }
}