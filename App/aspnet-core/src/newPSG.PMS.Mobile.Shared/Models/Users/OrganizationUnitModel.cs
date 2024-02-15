using Abp.AutoMapper;
using newPSG.PMS.Organizations.Dto;

namespace newPSG.PMS.Models.Users
{
    [AutoMapFrom(typeof(OrganizationUnitDto))]
    public class OrganizationUnitModel : OrganizationUnitDto
    {
        public bool IsAssigned { get; set; }
    }
}