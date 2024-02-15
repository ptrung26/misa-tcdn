using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Net.Mail;
using Abp.Runtime.Security;
using Abp.Timing;
using Abp.Zero.Configuration;
using newPSG.PMS.Authorization;
using newPSG.PMS.Configuration.Dto;
using newPSG.PMS.Configuration.Host.Dto;
using newPSG.PMS.Editions;
using newPSG.PMS.Security;
using newPSG.PMS.Timing;
using newPSG.PMS.UtilityService;
using Newtonsoft.Json;

namespace newPSG.PMS.Configuration.Host
{
    //[AbpAuthorize(AppPermissions.Pages_Administration_Host_Settings, AppPermissions.Pages_XayDungThucDon_CauHinhThucDon)]
    [AbpAuthorize]
    public class HostSettingsAppService : SettingsAppServiceBase, IHostSettingsAppService
    {
        private readonly EditionManager _editionManager;
        private readonly ITimeZoneService _timeZoneService;
        readonly ISettingDefinitionManager _settingDefinitionManager;
        private readonly IUtilityAppService _utilityAppService;

        public HostSettingsAppService(
            IEmailSender emailSender,
            EditionManager editionManager,
            ITimeZoneService timeZoneService,
            ISettingDefinitionManager settingDefinitionManager,
            IUtilityAppService utilityAppService
            ) : base(emailSender)
        {
            _editionManager = editionManager;
            _timeZoneService = timeZoneService;
            _settingDefinitionManager = settingDefinitionManager;
            _utilityAppService = utilityAppService;
        }

        #region Get Settings

        [AbpAuthorize(AppPermissions.Pages_Administration_Host_Settings)]
        public async Task<HostSettingsEditDto> GetAllSettings()
        {
            return new HostSettingsEditDto
            {
                General = await GetGeneralSettingsAsync(),
                TenantManagement = await GetTenantManagementSettingsAsync(),
                UserManagement = await GetUserManagementAsync(),
                Email = await GetEmailSettingsAsync(),
                Security = await GetSecuritySettingsAsync(),
                Billing = await GetBillingSettingsAsync(),
                OtherSettings = await GetOtherSettingsAsync()
            };
        }

        private async Task<GeneralSettingsEditDto> GetGeneralSettingsAsync()
        {
            var timezone = await SettingManager.GetSettingValueForApplicationAsync(TimingSettingNames.TimeZone);
            var settings = new GeneralSettingsEditDto
            {
                Timezone = timezone,
                TimezoneForComparison = timezone
            };

            var defaultTimeZoneId = await _timeZoneService.GetDefaultTimezoneAsync(SettingScopes.Application, AbpSession.TenantId);
            if (settings.Timezone == defaultTimeZoneId)
            {
                settings.Timezone = string.Empty;
            }

            return settings;
        }

        private async Task<TenantManagementSettingsEditDto> GetTenantManagementSettingsAsync()
        {
            var settings = new TenantManagementSettingsEditDto
            {
                AllowSelfRegistration = await SettingManager.GetSettingValueAsync<bool>(AppSettings.TenantManagement.AllowSelfRegistration),
                IsNewRegisteredTenantActiveByDefault = await SettingManager.GetSettingValueAsync<bool>(AppSettings.TenantManagement.IsNewRegisteredTenantActiveByDefault),
                UseCaptchaOnRegistration = await SettingManager.GetSettingValueAsync<bool>(AppSettings.TenantManagement.UseCaptchaOnRegistration),
            };

            var defaultEditionId = await SettingManager.GetSettingValueAsync(AppSettings.TenantManagement.DefaultEdition);
            if (!string.IsNullOrEmpty(defaultEditionId) && (await _editionManager.FindByIdAsync(Convert.ToInt32(defaultEditionId)) != null))
            {
                settings.DefaultEditionId = Convert.ToInt32(defaultEditionId);
            }

            return settings;
        }

        private async Task<HostUserManagementSettingsEditDto> GetUserManagementAsync()
        {
            return new HostUserManagementSettingsEditDto
            {
                IsEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin),
                SmsVerificationEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.SmsVerificationEnabled),
                IsCookieConsentEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.IsCookieConsentEnabled),
                IsQuickThemeSelectEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.IsQuickThemeSelectEnabled),
                UseCaptchaOnLogin = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.UseCaptchaOnLogin),
                SessionTimeOutSettings = new SessionTimeOutSettingsEditDto
                {
                    IsEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.SessionTimeOut.IsEnabled),
                    TimeOutSecond = await SettingManager.GetSettingValueAsync<int>(AppSettings.UserManagement.SessionTimeOut.TimeOutSecond),
                    ShowTimeOutNotificationSecond = await SettingManager.GetSettingValueAsync<int>(AppSettings.UserManagement.SessionTimeOut.ShowTimeOutNotificationSecond),
                    ShowLockScreenWhenTimedOut = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.SessionTimeOut.ShowLockScreenWhenTimedOut)
                }
            };
        }

        private async Task<EmailSettingsEditDto> GetEmailSettingsAsync()
        {
            var smtpPassword = await SettingManager.GetSettingValueAsync(EmailSettingNames.Smtp.Password);

            return new EmailSettingsEditDto
            {
                DefaultFromAddress = await SettingManager.GetSettingValueAsync(EmailSettingNames.DefaultFromAddress),
                DefaultFromDisplayName = await SettingManager.GetSettingValueAsync(EmailSettingNames.DefaultFromDisplayName),
                SmtpHost = await SettingManager.GetSettingValueAsync(EmailSettingNames.Smtp.Host),
                SmtpPort = await SettingManager.GetSettingValueAsync<int>(EmailSettingNames.Smtp.Port),
                SmtpUserName = await SettingManager.GetSettingValueAsync(EmailSettingNames.Smtp.UserName),
                SmtpPassword = SimpleStringCipher.Instance.Decrypt(smtpPassword),
                SmtpDomain = await SettingManager.GetSettingValueAsync(EmailSettingNames.Smtp.Domain),
                SmtpEnableSsl = await SettingManager.GetSettingValueAsync<bool>(EmailSettingNames.Smtp.EnableSsl),
                SmtpUseDefaultCredentials = await SettingManager.GetSettingValueAsync<bool>(EmailSettingNames.Smtp.UseDefaultCredentials)
            };
        }

        private async Task<SecuritySettingsEditDto> GetSecuritySettingsAsync()
        {
            var passwordComplexitySetting = new PasswordComplexitySetting
            {
                RequireDigit = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireDigit),
                RequireLowercase = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireLowercase),
                RequireNonAlphanumeric = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireNonAlphanumeric),
                RequireUppercase = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireUppercase),
                RequiredLength = await SettingManager.GetSettingValueAsync<int>(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequiredLength)
            };

            var defaultPasswordComplexitySetting = new PasswordComplexitySetting
            {
                RequireDigit = Convert.ToBoolean(_settingDefinitionManager.GetSettingDefinition(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireDigit).DefaultValue),
                RequireLowercase = Convert.ToBoolean(_settingDefinitionManager.GetSettingDefinition(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireLowercase).DefaultValue),
                RequireNonAlphanumeric = Convert.ToBoolean(_settingDefinitionManager.GetSettingDefinition(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireNonAlphanumeric).DefaultValue),
                RequireUppercase = Convert.ToBoolean(_settingDefinitionManager.GetSettingDefinition(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireUppercase).DefaultValue),
                RequiredLength = Convert.ToInt32(_settingDefinitionManager.GetSettingDefinition(AbpZeroSettingNames.UserManagement.PasswordComplexity.RequiredLength).DefaultValue)
            };

            return new SecuritySettingsEditDto
            {
                UseDefaultPasswordComplexitySettings = passwordComplexitySetting.Equals(defaultPasswordComplexitySetting),
                PasswordComplexity = passwordComplexitySetting,
                DefaultPasswordComplexity = defaultPasswordComplexitySetting,
                UserLockOut = await GetUserLockOutSettingsAsync(),
                TwoFactorLogin = await GetTwoFactorLoginSettingsAsync(),
                AllowOneConcurrentLoginPerUser = await GetOneConcurrentLoginPerUserSetting()
            };
        }

        private async Task<HostBillingSettingsEditDto> GetBillingSettingsAsync()
        {
            return new HostBillingSettingsEditDto
            {
                LegalName = await SettingManager.GetSettingValueAsync(AppSettings.HostManagement.BillingLegalName),
                Address = await SettingManager.GetSettingValueAsync(AppSettings.HostManagement.BillingAddress)
            };
        }

        private async Task<OtherSettingsEditDto> GetOtherSettingsAsync()
        {
            return new OtherSettingsEditDto()
            {
                IsQuickThemeSelectEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.IsQuickThemeSelectEnabled)
            };
        }

        private async Task<UserLockOutSettingsEditDto> GetUserLockOutSettingsAsync()
        {
            return new UserLockOutSettingsEditDto
            {
                IsEnabled = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.UserLockOut.IsEnabled),
                MaxFailedAccessAttemptsBeforeLockout = await SettingManager.GetSettingValueAsync<int>(AbpZeroSettingNames.UserManagement.UserLockOut.MaxFailedAccessAttemptsBeforeLockout),
                DefaultAccountLockoutSeconds = await SettingManager.GetSettingValueAsync<int>(AbpZeroSettingNames.UserManagement.UserLockOut.DefaultAccountLockoutSeconds)
            };
        }

        private async Task<TwoFactorLoginSettingsEditDto> GetTwoFactorLoginSettingsAsync()
        {
            var twoFactorLoginSettingsEditDto = new TwoFactorLoginSettingsEditDto
            {
                IsEnabled = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsEnabled),
                IsEmailProviderEnabled = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsEmailProviderEnabled),
                IsSmsProviderEnabled = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsSmsProviderEnabled),
                IsRememberBrowserEnabled = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsRememberBrowserEnabled),
                IsGoogleAuthenticatorEnabled = await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.TwoFactorLogin.IsGoogleAuthenticatorEnabled)
            };
            return twoFactorLoginSettingsEditDto;
        }

        private async Task<bool> GetOneConcurrentLoginPerUserSetting()
        {
            return await SettingManager.GetSettingValueAsync<bool>(AppSettings.UserManagement.AllowOneConcurrentLoginPerUser);
        }

        #endregion

        #region Update Settings

        [AbpAuthorize(AppPermissions.Pages_Administration_Host_Settings)]
        public async Task UpdateAllSettings(HostSettingsEditDto input)
        {
            await UpdateGeneralSettingsAsync(input.General);
            await UpdateTenantManagementAsync(input.TenantManagement);
            await UpdateUserManagementSettingsAsync(input.UserManagement);
            await UpdateSecuritySettingsAsync(input.Security);
            await UpdateEmailSettingsAsync(input.Email);
            await UpdateBillingSettingsAsync(input.Billing);
            await UpdateOtherSettingsAsync(input.OtherSettings);
        }

        private async Task UpdateOtherSettingsAsync(OtherSettingsEditDto input)
        {
            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.UserManagement.IsQuickThemeSelectEnabled,
                input.IsQuickThemeSelectEnabled.ToString().ToLowerInvariant()
            );
        }

        private async Task UpdateBillingSettingsAsync(HostBillingSettingsEditDto input)
        {
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.HostManagement.BillingLegalName, input.LegalName);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.HostManagement.BillingAddress, input.Address);
        }

        private async Task UpdateGeneralSettingsAsync(GeneralSettingsEditDto settings)
        {
            if (Clock.SupportsMultipleTimezone)
            {
                if (settings.Timezone.IsNullOrEmpty())
                {
                    var defaultValue = await _timeZoneService.GetDefaultTimezoneAsync(SettingScopes.Application, AbpSession.TenantId);
                    await SettingManager.ChangeSettingForApplicationAsync(TimingSettingNames.TimeZone, defaultValue);
                }
                else
                {
                    await SettingManager.ChangeSettingForApplicationAsync(TimingSettingNames.TimeZone, settings.Timezone);
                }
            }
        }

        private async Task UpdateTenantManagementAsync(TenantManagementSettingsEditDto settings)
        {
            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.TenantManagement.AllowSelfRegistration,
                settings.AllowSelfRegistration.ToString().ToLowerInvariant()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.TenantManagement.IsNewRegisteredTenantActiveByDefault,
                settings.IsNewRegisteredTenantActiveByDefault.ToString().ToLowerInvariant()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.TenantManagement.UseCaptchaOnRegistration,
                settings.UseCaptchaOnRegistration.ToString().ToLowerInvariant()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.TenantManagement.DefaultEdition,
                settings.DefaultEditionId?.ToString() ?? ""
            );
        }

        private async Task UpdateUserManagementSettingsAsync(HostUserManagementSettingsEditDto settings)
        {
            await SettingManager.ChangeSettingForApplicationAsync(
                AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin,
                settings.IsEmailConfirmationRequiredForLogin.ToString().ToLowerInvariant()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.UserManagement.SmsVerificationEnabled,
                settings.SmsVerificationEnabled.ToString().ToLowerInvariant()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.UserManagement.IsCookieConsentEnabled,
                settings.IsCookieConsentEnabled.ToString().ToLowerInvariant()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.UserManagement.UseCaptchaOnLogin,
                settings.UseCaptchaOnLogin.ToString().ToLowerInvariant()
            );

            await UpdateUserManagementSessionTimeOutSettingsAsync(settings.SessionTimeOutSettings);
        }

        private async Task UpdateUserManagementSessionTimeOutSettingsAsync(SessionTimeOutSettingsEditDto settings)
        {
            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.UserManagement.SessionTimeOut.IsEnabled,
                settings.IsEnabled.ToString().ToLowerInvariant()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.UserManagement.SessionTimeOut.TimeOutSecond,
                settings.TimeOutSecond.ToString()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.UserManagement.SessionTimeOut.ShowTimeOutNotificationSecond,
                settings.ShowTimeOutNotificationSecond.ToString()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AppSettings.UserManagement.SessionTimeOut.ShowLockScreenWhenTimedOut,
                settings.ShowLockScreenWhenTimedOut.ToString()
            );
        }

        private async Task UpdateSecuritySettingsAsync(SecuritySettingsEditDto settings)
        {
            if (settings.UseDefaultPasswordComplexitySettings)
            {
                await UpdatePasswordComplexitySettingsAsync(settings.DefaultPasswordComplexity);
            }
            else
            {
                await UpdatePasswordComplexitySettingsAsync(settings.PasswordComplexity);
            }

            await UpdateUserLockOutSettingsAsync(settings.UserLockOut);
            await UpdateTwoFactorLoginSettingsAsync(settings.TwoFactorLogin);
            await UpdateOneConcurrentLoginPerUserSettingAsync(settings.AllowOneConcurrentLoginPerUser);
        }

        private async Task UpdatePasswordComplexitySettingsAsync(PasswordComplexitySetting settings)
        {

            await SettingManager.ChangeSettingForApplicationAsync(
                AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireDigit,
                settings.RequireDigit.ToString()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireLowercase,
                settings.RequireLowercase.ToString()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireNonAlphanumeric,
                settings.RequireNonAlphanumeric.ToString()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AbpZeroSettingNames.UserManagement.PasswordComplexity.RequireUppercase,
                settings.RequireUppercase.ToString()
            );

            await SettingManager.ChangeSettingForApplicationAsync(
                AbpZeroSettingNames.UserManagement.PasswordComplexity.RequiredLength,
                settings.RequiredLength.ToString()
            );
        }

        private async Task UpdateUserLockOutSettingsAsync(UserLockOutSettingsEditDto settings)
        {
            await SettingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.UserLockOut.IsEnabled, settings.IsEnabled.ToString().ToLowerInvariant());
            await SettingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.UserLockOut.DefaultAccountLockoutSeconds, settings.DefaultAccountLockoutSeconds.ToString());
            await SettingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.UserLockOut.MaxFailedAccessAttemptsBeforeLockout, settings.MaxFailedAccessAttemptsBeforeLockout.ToString());
        }

        private async Task UpdateTwoFactorLoginSettingsAsync(TwoFactorLoginSettingsEditDto settings)
        {
            await SettingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsEnabled, settings.IsEnabled.ToString().ToLowerInvariant());
            await SettingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsEmailProviderEnabled, settings.IsEmailProviderEnabled.ToString().ToLowerInvariant());
            await SettingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsSmsProviderEnabled, settings.IsSmsProviderEnabled.ToString().ToLowerInvariant());
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.UserManagement.TwoFactorLogin.IsGoogleAuthenticatorEnabled, settings.IsGoogleAuthenticatorEnabled.ToString().ToLowerInvariant());
            await SettingManager.ChangeSettingForApplicationAsync(AbpZeroSettingNames.UserManagement.TwoFactorLogin.IsRememberBrowserEnabled, settings.IsRememberBrowserEnabled.ToString().ToLowerInvariant());
        }

        private async Task UpdateEmailSettingsAsync(EmailSettingsEditDto settings)
        {
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.DefaultFromAddress, settings.DefaultFromAddress);
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.DefaultFromDisplayName, settings.DefaultFromDisplayName);
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.Smtp.Host, settings.SmtpHost);
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.Smtp.Port, settings.SmtpPort.ToString(CultureInfo.InvariantCulture));
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.Smtp.UserName, settings.SmtpUserName);
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.Smtp.Password, SimpleStringCipher.Instance.Encrypt(settings.SmtpPassword));
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.Smtp.Domain, settings.SmtpDomain);
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.Smtp.EnableSsl, settings.SmtpEnableSsl.ToString().ToLowerInvariant());
            await SettingManager.ChangeSettingForApplicationAsync(EmailSettingNames.Smtp.UseDefaultCredentials, settings.SmtpUseDefaultCredentials.ToString().ToLowerInvariant());
        }

        private async Task UpdateOneConcurrentLoginPerUserSettingAsync(bool allowOneConcurrentLoginPerUser)
        {
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.UserManagement.AllowOneConcurrentLoginPerUser, allowOneConcurrentLoginPerUser.ToString());
        }

        #endregion

        #region GET All Cấu hình thực đơn tùy chỉnh
        public async Task<CHTDTuyChinhSetting> GetAllCHTDTuyChinhSetting()
        {

            return new CHTDTuyChinhSetting
            {
                CauHinhThucDonTE = await GetCauHinhThucDonTESetting(),
                CauHinhThucDonTEAC = await GetCauHinhThucDonTEACSetting(),
                CauHinhThucDonTSS = await GetCauHinhThucDonTSSSetting()
            };
        }
        public async Task<CauHinhThucDonTESettingsEditDto> GetCauHinhThucDonTeTheoThangTuoi(int thangTuoi)
        {
            var cauHinh = await GetCauHinhThucDonTESetting();
            cauHinh.MaNhomBanhKeo = cauHinh.MaNhomBanhKeo.Where(x => x.ThangTuoi_Min.HasValue? thangTuoi>= x.ThangTuoi_Min: true)
                .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomBot = cauHinh.MaNhomBot.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
              .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomChao = cauHinh.MaNhomChao.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
              .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomTraiCay = cauHinh.MaNhomTraiCay.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
              .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MonAnNhomBanhFlan = cauHinh.MonAnNhomBanhFlan.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
              .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MonAnNhomPhoMai = cauHinh.MonAnNhomPhoMai.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
              .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MonAnNhomSuaChua = cauHinh.MonAnNhomSuaChua.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
              .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MonAnNhomSuaCongThuc = cauHinh.MonAnNhomSuaCongThuc.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
             .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MonAnNhomVangSua = cauHinh.MonAnNhomVangSua.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
             .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            return cauHinh;
        }
        public async Task<CauHinhThucDonTEACSettingsEditDto> GetCauHinhThucDonTeacTheoThangTuoi(int thangTuoi)
        {
            var cauHinh = await GetCauHinhThucDonTEACSetting();
            cauHinh.MaNhomBanhKeo = cauHinh.MaNhomBanhKeo.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
                .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomCom = cauHinh.MaNhomCom.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
               .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomKhacCom = cauHinh.MaNhomKhacCom.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
               .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomMonAnCungCom = cauHinh.MaNhomMonAnCungCom.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
               .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomSpTuSua = cauHinh.MaNhomSpTuSua.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
             .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomSua = cauHinh.MaNhomSua.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
             .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            cauHinh.MaNhomTraiCay = cauHinh.MaNhomTraiCay.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
             .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            return cauHinh;
        }
        public async Task<CauHinhThucDonTSSSettingsEditDto> GetCauHinhThucDonTssTheoThangTuoi(int thangTuoi)
        {
            var cauHinh = await GetCauHinhThucDonTSSSetting();
            cauHinh.MaNhomSua = cauHinh.MaNhomSua.Where(x => x.ThangTuoi_Min.HasValue ? thangTuoi >= x.ThangTuoi_Min : true)
             .Where(x => x.ThangTuoi_Max.HasValue ? thangTuoi <= x.ThangTuoi_Max : true).ToList();
            return cauHinh;
        }
        private async Task<CauHinhThucDonTESettingsEditDto> GetCauHinhThucDonTESetting()
        {
            try
            {
                return new CauHinhThucDonTESettingsEditDto
                {
                    MaNhomBot = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomBot)),
                    MaNhomChao = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomChao)),
                    MaNhomTraiCay = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomTraiCay)),
                    MaNhomBanhKeo = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomBanhKeo)),
                    MonAnNhomSuaChua = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomSuaChua)),
                    MonAnNhomVangSua = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomVangSua)),
                    MonAnNhomPhoMai = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomPhoMai)),
                    MonAnNhomBanhFlan = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomBanhFlan)),
                    MonAnNhomSuaCongThuc = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomSuaCongThuc)),
                };
            }
            catch (Exception)
            {
                return new CauHinhThucDonTESettingsEditDto
                {
                    MaNhomBot = new List<NhomMaAndFilter>(),
                    MaNhomChao = new List<NhomMaAndFilter>(),
                    MaNhomTraiCay = new List<NhomMaAndFilter>(),
                    MaNhomBanhKeo = new List<NhomMaAndFilter>(),
                    MonAnNhomSuaChua = new List<NhomMaAndFilter>(),
                    MonAnNhomVangSua = new List<NhomMaAndFilter>(),
                    MonAnNhomPhoMai = new List<NhomMaAndFilter>(),
                    MonAnNhomBanhFlan = new List<NhomMaAndFilter>(),
                    MonAnNhomSuaCongThuc = new List<NhomMaAndFilter>(),
                };
            }

        }
        private async Task<CauHinhThucDonTEACSettingsEditDto> GetCauHinhThucDonTEACSetting()
        {
            try
            {
                return new CauHinhThucDonTEACSettingsEditDto
                {
                    MaNhomSua = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomSua)),
                    MaNhomBanhKeo = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomBanhKeo)),
                    MaNhomTraiCay = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomTraiCay)),
                    MaNhomNuocGiaiKhat = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomNuocGiaiKhat)),
                    MaNhomSpTuSua = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomSpTuSua)),
                    MaNhomCom = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomCom)),
                    MaNhomMonAnCungCom = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomMonAnCungCom)),
                    MaNhomKhacCom = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomKhacCom)),
                };
            }
            catch (Exception)
            {
                return new CauHinhThucDonTEACSettingsEditDto
                {
                    MaNhomSua = new List<NhomMaAndFilter>(),
                    MaNhomBanhKeo = new List<NhomMaAndFilter>(),
                    MaNhomTraiCay = new List<NhomMaAndFilter>(),
                    MaNhomNuocGiaiKhat = new List<NhomMaAndFilter>(),
                    MaNhomSpTuSua = new List<NhomMaAndFilter>(),
                    MaNhomCom = new List<NhomMaAndFilter>(),
                    MaNhomMonAnCungCom = new List<NhomMaAndFilter>(),
                    MaNhomKhacCom = new List<NhomMaAndFilter>(),
                };
            }

        }
        private async Task<CauHinhThucDonTSSSettingsEditDto> GetCauHinhThucDonTSSSetting()
        {
            try
            {
                return new CauHinhThucDonTSSSettingsEditDto
                {
                    MaNhomSua = JsonConvert.DeserializeObject<List<NhomMaAndFilter>>(await SettingManager.GetSettingValueAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTSS.MaNhomSua)),
                };
            }
            catch (Exception)
            {
                return new CauHinhThucDonTSSSettingsEditDto
                {
                    MaNhomSua = new List<NhomMaAndFilter>(),
                };
            }

        }
        #endregion END Cấu hình thực đơn tùy chỉnh

        #region UPDATE Cấu hình thực đơn tùy chỉnh
        public async Task UpdateAllCHTDTuyChinhSetting(UpdateCHTDTuyChinhSetting input)
        {
            var oldData =await GetAllCHTDTuyChinhSetting();
            var arrTe = await UpdateCauHinhThucDonTE(input.CauHinhThucDonTE);
            var arrTeac = await UpdateCauHinhThucDonTEAC(input.CauHinhThucDonTEAC);
            var arrTss = await UpdateCauHinhThucDonTSS(input.CauHinhThucDonTSS);

            await DeleteOldImg(oldData, arrTe.Concat(arrTeac).Concat(arrTss).ToList());
        }
        private async Task DeleteOldImg(CHTDTuyChinhSetting cauHinhOld, List<Guid> listImgNew)
        {
            var listImgOld = new List<Guid>();
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MaNhomBanhKeo.Where(x=>x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MaNhomBot.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MaNhomChao.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MaNhomTraiCay.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MonAnNhomBanhFlan.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MonAnNhomPhoMai.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MonAnNhomSuaChua.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MonAnNhomSuaCongThuc.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTE.MonAnNhomVangSua.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());

            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTEAC.MaNhomBanhKeo.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTEAC.MaNhomCom.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTEAC.MaNhomKhacCom.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTEAC.MaNhomMonAnCungCom.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTEAC.MaNhomSpTuSua.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTEAC.MaNhomSua.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());
            listImgOld.AddRange(cauHinhOld.CauHinhThucDonTEAC.MaNhomTraiCay.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList());

            await _utilityAppService.DeleteListImg(listImgOld.Where(x=>!listImgNew.Contains(x)).ToList());
        }
        private async Task<List<Guid>> UpdateCauHinhThucDonTE(UpdateCauHinhThucDonTESettingsEditDto input)
        {
            var listDataUpdate = new List<NhomMaAndFilter>();
            var maNhomBot = await UpdateListNhomMonAnFilter(input.MaNhomBot);
            listDataUpdate.AddRange(maNhomBot);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomBot,
              JsonConvert.SerializeObject(maNhomBot));

            var MaNhomChao = await UpdateListNhomMonAnFilter(input.MaNhomChao);
            listDataUpdate.AddRange(MaNhomChao);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomChao,
                JsonConvert.SerializeObject(MaNhomChao));

            var MaNhomTraiCay = await UpdateListNhomMonAnFilter(input.MaNhomTraiCay);
            listDataUpdate.AddRange(MaNhomTraiCay);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomTraiCay,
                JsonConvert.SerializeObject(MaNhomTraiCay));

            var MaNhomBanhKeo = await UpdateListNhomMonAnFilter(input.MaNhomBanhKeo);
            listDataUpdate.AddRange(MaNhomBanhKeo);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomBanhKeo,
                JsonConvert.SerializeObject(MaNhomBanhKeo));

            var MonAnNhomSuaChua = await UpdateListNhomMonAnFilter(input.MonAnNhomSuaChua);
            listDataUpdate.AddRange(MonAnNhomSuaChua);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomSuaChua,
              JsonConvert.SerializeObject(MonAnNhomSuaChua));

            var MonAnNhomVangSua = await UpdateListNhomMonAnFilter(input.MonAnNhomVangSua);
            listDataUpdate.AddRange(MonAnNhomVangSua);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomVangSua,
         JsonConvert.SerializeObject(MonAnNhomVangSua));

            var MonAnNhomPhoMai = await UpdateListNhomMonAnFilter(input.MonAnNhomPhoMai);
            listDataUpdate.AddRange(MonAnNhomPhoMai);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomPhoMai,
           JsonConvert.SerializeObject(MonAnNhomPhoMai));

            var MonAnNhomBanhFlan = await UpdateListNhomMonAnFilter(input.MonAnNhomBanhFlan);
            listDataUpdate.AddRange(MonAnNhomBanhFlan);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomBanhFlan,
            JsonConvert.SerializeObject(MonAnNhomBanhFlan));

            var MonAnNhomSuaCongThuc = await UpdateListNhomMonAnFilter(input.MonAnNhomSuaCongThuc);
            listDataUpdate.AddRange(MonAnNhomSuaCongThuc);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTE.MaNhomSuaCongThuc,
         JsonConvert.SerializeObject(MonAnNhomSuaCongThuc));

            return listDataUpdate.Where(x=>x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList();
        }
        private async Task<List<Guid>> UpdateCauHinhThucDonTEAC(UpdateCauHinhThucDonTEACSettingsEditDto input)
        {
            var listDataUpdate = new List<NhomMaAndFilter>();
            var MaNhomSua = await UpdateListNhomMonAnFilter(input.MaNhomSua);
            listDataUpdate.AddRange(MaNhomSua);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomSua,
            JsonConvert.SerializeObject(MaNhomSua));

            var MaNhomBanhKeo = await UpdateListNhomMonAnFilter(input.MaNhomBanhKeo);
            listDataUpdate.AddRange(MaNhomBanhKeo);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomBanhKeo,
          JsonConvert.SerializeObject(MaNhomBanhKeo));

            var MaNhomTraiCay = await UpdateListNhomMonAnFilter(input.MaNhomTraiCay);
            listDataUpdate.AddRange(MaNhomTraiCay);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomTraiCay,
             JsonConvert.SerializeObject(MaNhomTraiCay));

            var MaNhomNuocGiaiKhat = await UpdateListNhomMonAnFilter(input.MaNhomNuocGiaiKhat);
            listDataUpdate.AddRange(MaNhomNuocGiaiKhat);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomNuocGiaiKhat,
             JsonConvert.SerializeObject(MaNhomNuocGiaiKhat));

            var MaNhomSpTuSua = await UpdateListNhomMonAnFilter(input.MaNhomSpTuSua);
            listDataUpdate.AddRange(MaNhomSpTuSua);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomSpTuSua,
           JsonConvert.SerializeObject(MaNhomSpTuSua));

            var MaNhomCom = await UpdateListNhomMonAnFilter(input.MaNhomCom);
            listDataUpdate.AddRange(MaNhomCom);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomCom,
          JsonConvert.SerializeObject(MaNhomCom));

            var MaNhomMonAnCungCom = await UpdateListNhomMonAnFilter(input.MaNhomMonAnCungCom);
            listDataUpdate.AddRange(MaNhomMonAnCungCom);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomMonAnCungCom,
        JsonConvert.SerializeObject(MaNhomMonAnCungCom));

            var MaNhomKhacCom = await UpdateListNhomMonAnFilter(input.MaNhomKhacCom);
            listDataUpdate.AddRange(MaNhomKhacCom);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTEAC.MaNhomKhacCom,
          JsonConvert.SerializeObject(MaNhomKhacCom));

            return listDataUpdate.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList();
        }

        private async Task<List<Guid>> UpdateCauHinhThucDonTSS(UpdateCauHinhThucDonTSSSettingsEditDto input)
        {
            var listDataUpdate = new List<NhomMaAndFilter>();
            var MaNhomSua = await UpdateListNhomMonAnFilter(input.MaNhomSua);
            listDataUpdate.AddRange(MaNhomSua);
            await SettingManager.ChangeSettingForApplicationAsync(AppSettings.CHTDTuyChinhManagement.ThucDonTSS.MaNhomSua,
            JsonConvert.SerializeObject(MaNhomSua));

            return listDataUpdate.Where(x => x.ImgBinaryObjectId.HasValue).Select(x => x.ImgBinaryObjectId.Value).ToList();
        }

        private async Task<List<NhomMaAndFilter>> UpdateListNhomMonAnFilter(List<UpdateNhomMaAndFilter> listData)
        {
            var res = new List<NhomMaAndFilter>();
            foreach (var item in listData)
            {
                var img = await UpdateImg(item.FileToken, item.ImgBinaryObjectId);

                res.Add(new NhomMaAndFilter
                {
                    NhomMonAnId = item.NhomMonAnId,
                    ThangTuoi_Min = item.ThangTuoi_Min,
                    ThangTuoi_Max = item.ThangTuoi_Max,
                    TenHienThi = item.TenHienThi,
                    ImgBinaryObjectId = img
                });
            }
            //return JsonConvert.SerializeObject(res);
            return res;
        }
        private async Task<Guid?> UpdateImg(string fileToken, Guid? imgIdOld)
        {

            if (!string.IsNullOrEmpty(fileToken))
            {
                if (imgIdOld.HasValue)
                {
                    await _utilityAppService.DeleteImg(imgIdOld.Value);
                }
                return await _utilityAppService.UploadImg(fileToken);
            }
            else
                return imgIdOld;
        }
        //private async Task<Guid?> InsertImg(string fileToken)
        //{
        //    if (!string.IsNullOrEmpty(fileToken))
        //    {
        //        return await _utilityAppService.UploadImg(fileToken);
        //    }
        //    else
        //        return null;
        //}

        #endregion END  Cấu hình thực đơn tùy chỉnh
    }
}