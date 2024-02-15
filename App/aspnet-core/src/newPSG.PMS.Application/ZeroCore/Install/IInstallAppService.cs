using System.Threading.Tasks;
using Abp.Application.Services;
using newPSG.PMS.Install.Dto;

namespace newPSG.PMS.Install
{
    public interface IInstallAppService : IApplicationService
    {
        Task Setup(InstallDto input);

        AppSettingsJsonDto GetAppSettingsJson();

        CheckDatabaseOutput CheckDatabase();
    }
}