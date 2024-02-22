using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;
using newPSG.PMS.Storage;
using Syncfusion.EJ2.Linq;
using Syncfusion.XlsIO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTaiKhoanManagement.Bussiness
{
    public class ExportDanhMucTaiKhoanRequest : PagedFullInputDto, IRequest<FileDto>
    {

    }

    public class ExportDanhMucTaiKhoanHandler : IRequestHandler<ExportDanhMucTaiKhoanRequest, FileDto>
    {
        private readonly IRepository<DanhMucTaiKhoanEntity> _tkRepos;
        private readonly IAppFolders _appFolders;
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public ExportDanhMucTaiKhoanHandler(IRepository<DanhMucTaiKhoanEntity> tkRepos, IAppFolders appFolders, ITempFileCacheManager tempFileCacheManager)
        {
            _appFolders = appFolders;
            _tkRepos = tkRepos;
            _tempFileCacheManager = tempFileCacheManager;
        }


        public async Task<FileDto> Handle(ExportDanhMucTaiKhoanRequest request, CancellationToken cancellationToken)
        {
            try
            {
                request.Format();
                var query = _tkRepos.GetAll().WhereIf(!string.IsNullOrEmpty(request.Filter), tk => EF.Functions.Like(tk.TenTaiKhoan, request.FilterFullText) || EF.Functions.Like(tk.SoTaiKhoan, request.FilterFullText)).Select(_tk => new DanhMucTaiKhoanExportDto
                {
                    Id = _tk.Id,
                    SoTaiKhoan = _tk.SoTaiKhoan,
                    TenTaiKhoan = _tk.TenTaiKhoan,
                    TenTiengAnh = _tk.TenTiengAnh,
                    DienGiai = _tk.DienGiai,
                    TinhChat = _tk.TinhChat,
                    TrangThai = _tk.IsActive == true ? 1 : 0,

                });

                var result = await query.ToListAsync();
                using (ExcelEngine excelEngine = new ExcelEngine())
                {

                    var application = excelEngine.Excel;
                    var templateAbsolutePath = Path.Combine(_appFolders.Template, "DanhMucTaiKhoan_Template.xlsx");
                    var fileStream = new FileStream(templateAbsolutePath, FileMode.Open, FileAccess.Read);
                    var workbook = application.Workbooks.Open(fileStream);

                    // Khởi tạo Template Marker Processor 
                    var marker = workbook.CreateTemplateMarkersProcessor();

                    marker.AddVariable("DanhMucTaiKhoan", result, VariableTypeAction.DetectNumberFormat);

                    marker.ApplyMarkers();

                    workbook.Version = ExcelVersion.Excel2013;

                    byte[] renderedBytes = null;
                    using (MemoryStream ms = new MemoryStream())
                    {
                        workbook.SaveAs(ms);
                        renderedBytes = ms.ToArray();
                        var outputFile = new FileDto("Danh_sach_tai_khoan.xlsx", "application/msexcel");
                        _tempFileCacheManager.SetFile(outputFile.FileToken, renderedBytes);
                        return outputFile;

                    }


                }
            }
            catch
            {

                throw;
            }



        }
    }
}
