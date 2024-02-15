using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Linq;
using Abp.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using newPSG.PMS.AppCore.API_Mobile._ResultApiBase.Dto;
using newPSG.PMS.AppCore.API_Mobile.TaiKhoanNguoiDung.Dto;
//using newPSG.PMS.AppCore.ThanhVien;
using newPSG.PMS.Authorization.Accounts;
using newPSG.PMS.Authorization.Accounts.Dto;
using newPSG.PMS.Authorization.Roles;
using newPSG.PMS.Authorization.Users;
using newPSG.PMS.Authorization.Users.Profile;
using newPSG.PMS.Authorization.Users.Profile.Dto;
using newPSG.PMS.FireBaseServer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPSG.PMS.AppCore.API_Mobile
{
    public interface ITaiKhoanNguoiDungAppService
    {
        Task<ReturnReponse<User>> DangKyTaiKhoan(RegisterSimpleInput input);
        Task<ReturnReponse<long?>> QuenMatKhau(SendPasswordResetCodeInput input);
        Task<ReturnReponse<ResetPasswordOutput>> DoiMatKhauRestCode(ResetPasswordInput input);
    }
    [AllowAnonymous]
    public class TaiKhoanNguoiDungAppService : PMSAppServiceBase, ITaiKhoanNguoiDungAppService
    {
        public int? _tenantId = null;
        public IAsyncQueryableExecuter AsyncQueryableExecuter { get; set; }
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IRepository<User, long> _userRepos;
        //private readonly IRepository<ThanhVienEntity, long> _thanhVienRepos;
        private readonly IAccountAppService _accountService;
        private readonly IProfileAppService _profireService;
        private readonly IUserFireBaseTokensAppService _fireBaseService;
        public TaiKhoanNguoiDungAppService(UserManager userManager,
            RoleManager roleManager,
            IRepository<User, long> userRepos,
            //IRepository<ThanhVienEntity, long> thanhVienRepos,
            IAccountAppService accountService,
            IProfileAppService profireService,
            IUserFireBaseTokensAppService fireBaseService
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userRepos = userRepos;
            //_thanhVienRepos = thanhVienRepos;
            _accountService = accountService;
            _profireService = profireService;
            _fireBaseService = fireBaseService;
            AsyncQueryableExecuter = NullAsyncQueryableExecuter.Instance;

        }
        public async Task<ReturnReponse<User>> DangKyTaiKhoan(RegisterSimpleInput input)
        {
            var res = new ReturnReponse<User>();
            using (CurrentUnitOfWork.SetTenantId(_tenantId))
            {
                try
                {
                    var user = new User
                    {
                        TenantId = _tenantId,
                        Name = input.Name,
                        Surname = input.Surname,
                        EmailAddress = input.EmailAddress,
                        IsActive = true,
                        UserName = input.UserName,
                        PhoneNumber = input.SoDienThoai,
                        IsEmailConfirmed = false,
                        Password = input.Password,
                        Roles = new List<UserRole>()
                    };

                    user.SetNormalizedNames();

                    var defaultRoles = await AsyncQueryableExecuter.ToListAsync(_roleManager.Roles.Where(r => r.IsDefault));
                    foreach (var defaultRole in defaultRoles)
                    {
                        user.Roles.Add(new UserRole(null, user.Id, defaultRole.Id));
                    }

                    await _userManager.InitializeOptionsAsync(_tenantId);
                    try
                    {
                        await CheckDoubleUserName_Email(input);
                        CheckErrors(await _userManager.CreateAsync(user, input.Password));
                     
                        //await _thanhVienRepos.InsertAsync(new ThanhVienEntity
                        //{
                        //    Ten = user.Name,
                        //    Ho = user.Surname,
                        //    Ngay_Sinh = DateTime.Now,
                        //    Gioi_Tinh = CommonEnum.GIOI_TINH.Nam,
                        //    Phone = user.PhoneNumber,
                        //    Email = user.EmailAddress,
                        //    UserId = user.Id,
                        //});

                        res.Data = user;
                    }
                    catch (Exception ex)
                    {
                        res.Success = false;
                        res.Error = new ErrorResponse(201, ex.Message);
                        return res;
                    }

                   
                }
                catch 
                {
                    res.Success = false;
                    res.Error = new ErrorResponse(203, "Lỗi hệ thống!");
                    return res;
                }
                
                return res;



                //if (!user.IsEmailConfirmed)
                //{
                //    user.SetNewEmailConfirmationCode();
                //    await _userEmailer.SendEmailActivationLinkAsync(user, emailActivationLink);
                //}

                //Notifications
                //await _notificationSubscriptionManager.SubscribeToAllAvailableNotificationsAsync(user.ToUserIdentifier());
                //await _appNotifier.WelcomeToTheApplicationAsync(user);
                //await _appNotifier.NewUserRegisteredAsync(user);

            }
        }
        private async Task CheckDoubleUserName_Email(RegisterSimpleInput input)
        {
            var _fByUser = await _userManager.FindByNameAsync(input.UserName);
            if (_fByUser != null)
                throw new UserFriendlyException("Tên tài khoản đã tồn tại!");
            var _fByEmail = await _userManager.FindByEmailAsync(input.EmailAddress);
            if (_fByEmail != null)
                throw new UserFriendlyException("Email đã tồn tại!");
        }
        public async Task<ReturnReponse<long?>> QuenMatKhau(SendPasswordResetCodeInput input)
        {
            using (CurrentUnitOfWork.SetTenantId(_tenantId))
            {
                var res = new ReturnReponse<long?>();
                try
                {
                    await _accountService.SendPasswordResetCode(input);
                    var user = await _userRepos.FirstOrDefaultAsync(x => x.EmailAddress == input.EmailAddress);
                    res.Data = user.Id;
                }
                catch (Exception ex)
                {
                    res.Success = false;
                    res.Error = new ErrorResponse(201, ex.Message);
                }
                return res;

            }
        }
        /// <summary>
        /// Hàm Test Không dùng để làm việc 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<string> ShowRestCode(long userId)
        {
            var user = await _userRepos.GetAsync(userId);
            return user.PasswordResetCode;
        }

        public async Task<ReturnReponse<ResetPasswordOutput>> DoiMatKhauRestCode(ResetPasswordInput input)
        {
            using (CurrentUnitOfWork.SetTenantId(_tenantId))
            {
                var res = new ReturnReponse<ResetPasswordOutput>();
                try
                {
                    res.Data = await _accountService.ResetPassword(input);
                }
                catch (UserFriendlyException ex)
                {
                    res.Success = false;
                    res.Error = new ErrorResponse(ex.Code, ex.Message);
                }
                return res;
            }
        }
      

        public async Task<ReturnReponse<bool>> DoiMatKhau(ChangePasswordInput input)
        {
            using (CurrentUnitOfWork.SetTenantId(_tenantId))
            {
                var res = new ReturnReponse<bool>();
                try
                {
                    await _profireService.ChangePassword(input);
                    res.Data = true;
                }
                catch (Exception ex)
                {
                    res.Success = false;
                    res.Error = new ErrorResponse(201, ex.Message);
                }
                return res;
            }
        }
    }
}
