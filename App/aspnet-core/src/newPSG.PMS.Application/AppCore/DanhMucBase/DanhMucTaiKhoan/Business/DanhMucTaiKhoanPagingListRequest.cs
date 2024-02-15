using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using MediatR;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Abp.Linq.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using newPSG.PMS.DanhMucTinh.Dto;
using Abp.AutoMapper;

namespace newPSG.PMS.DanhMucHuyenManagement.Business
{
    public class DanhMucTaiKhoanPagingListRequest : PagedFullInputDto, IRequest<PagedResultDto<DanhMucTaiKhoanDto>>
    {
    }

    public class DanhMucTaiKhoanPagingListHandler : IRequestHandler<DanhMucTaiKhoanPagingListRequest, PagedResultDto<DanhMucTaiKhoanDto>>
    {
        private readonly IRepository<DanhMucTaiKhoanEntity> _tkRepos;
        public DanhMucTaiKhoanPagingListHandler(IRepository<DanhMucTaiKhoanEntity> tkRepos)
        {
            _tkRepos = tkRepos;
        }

        public async Task<PagedResultDto<DanhMucTaiKhoanDto>> Handle(DanhMucTaiKhoanPagingListRequest request, CancellationToken cancellationToken)
        {
            request.Format();
            var query = (from t in _tkRepos.GetAll() select t.MapTo<DanhMucTaiKhoanDto>())
                .WhereIf(!string.IsNullOrEmpty(request.Filter), tk => EF.Functions.Like(tk.TenTaiKhoan, request.Filter) || EF.Functions.Like(tk.SoTaiKhoan, request.Filter));

            var dataGrids = await query
              .OrderBy("id asc")
              .PageBy(request)
              .ToListAsync(cancellationToken);

            var tkCount = await query.CountAsync(cancellationToken);
            var result = new PagedResultDto<DanhMucTaiKhoanDto>(tkCount, dataGrids);
            return result;


        }
    }
}
