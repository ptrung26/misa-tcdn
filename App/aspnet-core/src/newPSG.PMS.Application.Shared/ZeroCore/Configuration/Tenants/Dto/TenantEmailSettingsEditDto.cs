using Abp.Auditing;
using newPSG.PMS.Configuration.Dto;

namespace newPSG.PMS.Configuration.Tenants.Dto
{
    public class TenantEmailSettingsEditDto : EmailSettingsEditDto
    {
        public bool UseHostDefaultEmailSettings { get; set; }
    }
}