using newPSG.PMS.Authorization.Accounts.Dto;
using newPSG.PMS.FireBaseServer.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace newPSG.PMS.AppCore.API_Mobile.TaiKhoanNguoiDung.Dto
{
    public class DangKyTaiKhoanInputDto
    {
        public RegisterInput ThongTinDangKy { get; set; }
        public CreateOrEditUserFireBaseTokenDto FireBaseToken { get; set; }
    }
}
