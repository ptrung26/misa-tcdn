using System.Threading.Tasks;
using Abp.Application.Services;
using newPSG.PMS.Configuration.Dto;
using newPSG.PMS.Configuration.Host.Dto;

namespace newPSG.PMS.Configuration.Host
{
    public interface IHostSettingsAppService : IApplicationService
    {
        Task<HostSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(HostSettingsEditDto input);

        Task SendTestEmail(SendTestEmailInput input);

        Task<CHTDTuyChinhSetting> GetAllCHTDTuyChinhSetting();
        Task UpdateAllCHTDTuyChinhSetting(UpdateCHTDTuyChinhSetting input);
        Task<CauHinhThucDonTESettingsEditDto> GetCauHinhThucDonTeTheoThangTuoi(int thangTuoi);
        Task<CauHinhThucDonTEACSettingsEditDto> GetCauHinhThucDonTeacTheoThangTuoi(int thangTuoi);

    }
}
