using System.Threading.Tasks;
using Abp.Application.Services;
using newPSG.PMS.Editions.Dto;
using newPSG.PMS.MultiTenancy.Dto;

namespace newPSG.PMS.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);

        Task<EditionsSelectOutput> GetEditionsForSelect();

        Task<EditionSelectDto> GetEdition(int editionId);
    }
}