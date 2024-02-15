using System;
using System.Collections.Generic;
using System.Text;

namespace newPSG.PMS.Configuration.Dto
{
    #region GET DATA
    public class CauHinhThucDonTESettingsEditDto
    {
        public List<NhomMaAndFilter> MaNhomBot { get; set; }
        public List<NhomMaAndFilter> MaNhomChao { get; set; }
        public List<NhomMaAndFilter> MaNhomTraiCay { get; set; }
        public List<NhomMaAndFilter> MaNhomBanhKeo { get; set; }
        public List<NhomMaAndFilter> MonAnNhomSuaChua { get; set; }
        public List<NhomMaAndFilter> MonAnNhomVangSua { get; set; }
        public List<NhomMaAndFilter> MonAnNhomPhoMai { get; set; }
        public List<NhomMaAndFilter> MonAnNhomBanhFlan { get; set; }
        public List<NhomMaAndFilter> MonAnNhomSuaCongThuc { get; set; }

    }
    public class NhomMaAndFilter
    {
        public string TenHienThi { get; set; }
        public int NhomMonAnId { get; set; }
        public int? ThangTuoi_Min { get; set; }
        public int? ThangTuoi_Max { get; set; }
        public Guid? ImgBinaryObjectId { get; set; }
    }
    public class CauHinhThucDonTEACSettingsEditDto
    {
        public List<NhomMaAndFilter> MaNhomSua { get; set; }
        #region Món ăn vặt hằng ngày
        public List<NhomMaAndFilter> MaNhomBanhKeo { get; set; }
        public List<NhomMaAndFilter> MaNhomTraiCay { get; set; }
        public List<NhomMaAndFilter> MaNhomSpTuSua { get; set; }
        #endregion
        public List<NhomMaAndFilter> MaNhomNuocGiaiKhat { get; set; }
        public List<NhomMaAndFilter> MaNhomCom { get; set; }
        public List<NhomMaAndFilter> MaNhomMonAnCungCom { get; set; }
        public List<NhomMaAndFilter> MaNhomKhacCom { get; set; }
    }
    public class CauHinhThucDonTSSSettingsEditDto
    {
        public List<NhomMaAndFilter> MaNhomSua { get; set; }
    }

    #endregion end GET DATA

    #region UPDATA DATA
    public class UpdateCauHinhThucDonTESettingsEditDto
    {
        public List<UpdateNhomMaAndFilter> MaNhomBot { get; set; }
        public List<UpdateNhomMaAndFilter> MaNhomChao { get; set; }
        public List<UpdateNhomMaAndFilter> MaNhomTraiCay { get; set; }
        public List<UpdateNhomMaAndFilter> MaNhomBanhKeo { get; set; }
        public List<UpdateNhomMaAndFilter> MonAnNhomSuaChua { get; set; }
        public List<UpdateNhomMaAndFilter> MonAnNhomVangSua { get; set; }
        public List<UpdateNhomMaAndFilter> MonAnNhomPhoMai { get; set; }
        public List<UpdateNhomMaAndFilter> MonAnNhomBanhFlan { get; set; }
        public List<UpdateNhomMaAndFilter> MonAnNhomSuaCongThuc { get; set; }

    }
    public class UpdateNhomMaAndFilter : NhomMaAndFilter
    {
        public string FileToken { get; set; }
    }
    public class UpdateCauHinhThucDonTEACSettingsEditDto
    {
        public List<UpdateNhomMaAndFilter> MaNhomSua { get; set; }
        #region Món ăn vặt hằng ngày
        public List<UpdateNhomMaAndFilter> MaNhomBanhKeo { get; set; }
        public List<UpdateNhomMaAndFilter> MaNhomTraiCay { get; set; }
        public List<UpdateNhomMaAndFilter> MaNhomNuocGiaiKhat { get; set; }
        public List<UpdateNhomMaAndFilter> MaNhomSpTuSua { get; set; }
        #endregion
        public List<UpdateNhomMaAndFilter> MaNhomCom { get; set; }
        public List<UpdateNhomMaAndFilter> MaNhomMonAnCungCom { get; set; }
        public List<UpdateNhomMaAndFilter> MaNhomKhacCom { get; set; }
    }

    public class UpdateCauHinhThucDonTSSSettingsEditDto
    {
        public List<UpdateNhomMaAndFilter> MaNhomSua { get; set; }
    }

    #endregion end UPDATA DATA


    }
