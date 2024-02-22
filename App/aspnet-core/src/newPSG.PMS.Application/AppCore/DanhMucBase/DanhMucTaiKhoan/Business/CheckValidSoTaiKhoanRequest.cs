using Abp.Domain.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucHuyenManagement.Business
{
    public class CheckValidSoTaiKhoanRequest : IRequest<bool>
    {
        [Required]
        public string SoTaiKhoan { get; set; }
    }

    public class CheckValidSoTaiKhoanHandler : IRequestHandler<CheckValidSoTaiKhoanRequest, bool>
    {
        private readonly IRepository<DanhMucTaiKhoanEntity> _tkRepos;
        public CheckValidSoTaiKhoanHandler(IRepository<DanhMucTaiKhoanEntity> tkRepos)
        {
            _tkRepos = tkRepos;
        }

        public async Task<bool> Handle(CheckValidSoTaiKhoanRequest request, CancellationToken cancellationToken)
        {
            return await _tkRepos.GetAll().AnyAsync(tk => tk.SoTaiKhoan == request.SoTaiKhoan);

        }


    }


}
