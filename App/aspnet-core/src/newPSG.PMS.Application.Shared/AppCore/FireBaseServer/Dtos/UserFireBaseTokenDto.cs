
using System;
using Abp.Application.Services.Dto;

namespace newPSG.PMS.FireBaseServer.Dtos
{
    public class UserFireBaseTokenDto : EntityDto<long>
    {
		public string FireBaseToken { get; set; }

		public long UserId { get; set; }

		public string Platform { get; set; }
        public string Version { get; set; }

    }
}