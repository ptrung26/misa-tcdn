using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using newPSG.PMS.EntityFrameworkCore;
using System;

namespace newPSG.PMS.Migrations.Seed.Host
{
    public class SqlCustom
    {
        private readonly PMSDbContext _context;

        public SqlCustom(PMSDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            // nếu thời hiện tại >= thời gian truyền vào : sẽ ko thực hiện migration DB 
            if (DateTime.Now >= new DateTime(2021, 05, 05, 13, 00, 00))
            {
                return;
            }

            CreateFuncGetNangLuongMonAn();
            CreateFuncGetDinhDuongMonAn();
            CreateFuncGetKhoiLuongMonAn();
        }
        private void CreateFuncGetNangLuongMonAn()
        {
            _context.Database.ExecuteSqlRaw(@"SET GLOBAL log_bin_trust_function_creators = 1;");
            _context.Database.ExecuteSqlRaw(@"DROP function IF EXISTS `fn_get_nang_luong_mon_an`;");
            _context.Database.ExecuteSqlRaw(@"CREATE FUNCTION fn_get_nang_luong_mon_an (monAnId bigint)
                RETURNS decimal(10,5)
                NOT DETERMINISTIC
                BEGIN
                DECLARE select_var decimal(10,5);
                select SUM( ifnull(kttp.KhoiLuong,1) * ma_tp.KhoiLuong *  tp.NangLuongKcal / 100 ) INTO select_var   from mon_an__thucpham ma_tp
                join thuc_pham tp on ma_tp.ThucPhamId = tp.Id
                left join kichthuockhauphan_thucpham kttp on ma_tp.KichThuocKhauPhanId = kttp.Id
                where ma_tp.MonAnId = monAnId and ma_tp.IsDeleted = 0 and tp.IsDeleted = 0;
                RETURN select_var;
                END;");
            //CreateMonAnNangLuongView();
        }
        //private void CreateMonAnNangLuongView()
        //{
        //    _context.Database.ExecuteSqlRaw(@"DROP VIEW IF EXISTS `v_mon_an_nang_luong`;");
        //    _context.Database.ExecuteSqlRaw(@"
        //    CREATE VIEW `v_mon_an_nang_luong` AS
        //    SELECT
        //    *,
        //    FN_GET_NANG_LUONG_MON_AN(mon_an.Id) AS NangLuong
        //    FROM
        //    mon_an");
        //}
        private void CreateFuncGetDinhDuongMonAn()
        {
            _context.Database.ExecuteSqlRaw(@"SET GLOBAL log_bin_trust_function_creators = 1;");
            _context.Database.ExecuteSqlRaw(@"DROP function IF EXISTS `fn_get_dinh_duong_mon_an`;");
            _context.Database.ExecuteSqlRaw(@"CREATE FUNCTION fn_get_dinh_duong_mon_an(monAnId bigint, dinhDuongId bigint) RETURNS decimal(10,5)
                BEGIN
                DECLARE select_var decimal(10,5);
                select sum(ifnull(kttp.KhoiLuong,1) * ifnull(ma_tp.KhoiLuong,0) * ifnull(tp_dd.HamLuong,0)/100) INTO select_var   from mon_an ma
				join mon_an__thucpham ma_tp on ma.Id = ma_tp.MonAnId
				left join kichthuockhauphan_thucpham kttp on ma_tp.KichThuocKhauPhanId = kttp.Id
				join thuc_pham tp on ma_tp.ThucPhamId = tp.Id
				join thuc_pham__dinh_duong tp_dd on tp.Id = tp_dd.ThucPhamId
				where ma.Id = monAnId
				and tp_dd.DinhDuongId = dinhDuongId
				and ma_tp.IsDeleted = 0
				 and tp.IsDeleted = 0;
                RETURN ifnull(select_var,0);
                END;");
        }
        private void CreateFuncGetKhoiLuongMonAn()
        {
            _context.Database.ExecuteSqlRaw(@"SET GLOBAL log_bin_trust_function_creators = 1;");
            _context.Database.ExecuteSqlRaw(@"DROP function IF EXISTS `fn_get_khoi_luong_ma`;");
            _context.Database.ExecuteSqlRaw(@"CREATE FUNCTION fn_get_khoi_luong_ma (monAnId bigint)
                RETURNS decimal(10,5)
                NOT DETERMINISTIC
                BEGIN
                DECLARE select_var decimal(10,5);
                select SUM( ifnull(kttp.KhoiLuong,1) * ma_tp.KhoiLuong) INTO select_var   from mon_an__thucpham ma_tp
                join thuc_pham tp on ma_tp.ThucPhamId = tp.Id
                left join kichthuockhauphan_thucpham kttp on ma_tp.KichThuocKhauPhanId = kttp.Id
                where ma_tp.MonAnId = monAnId and ma_tp.IsDeleted = 0 and tp.IsDeleted = 0;
                RETURN select_var;
                end;");
        }
    }
}
