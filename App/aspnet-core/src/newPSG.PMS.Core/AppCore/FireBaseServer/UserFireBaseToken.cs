using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace newPSG.PMS.AppCore.FireBaseServer
{
	[Table("UserFireBaseTokens")]
	public class UserFireBaseToken : CreationAuditedEntity<long>
	{

		public virtual string FireBaseToken { get; set; }

		public virtual long UserId { get; set; }

		public virtual string Platform { get; set; }

		public virtual string Version { get; set; }

	}
}
