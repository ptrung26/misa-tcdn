using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.UI;
using MediatR;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucTaiKhoanManagement.Bussiness
{
    public class DanhMucTaiKhoanUpsertRequest : DanhMucTaiKhoanUpsertDto, IRequest<int>
    {

    }

    [Obsolete]
    public class InsertOrUpdateHandler : IRequestHandler<DanhMucTaiKhoanUpsertRequest, int>
    {
        private readonly IRepository<DanhMucTaiKhoanEntity> _tkRepos;
        public InsertOrUpdateHandler(IRepository<DanhMucTaiKhoanEntity> tkRepos)
        {
            this._tkRepos = tkRepos;
        }

        public async Task<int> Handle(DanhMucTaiKhoanUpsertRequest request, CancellationToken cancellationToken)
        {

            // Validate 
            if (request.SoTaiKhoan.Length < 3)
            {
                throw new UserFriendlyException("Số tài khoản không được nhỏ hơn 3");
            }

            if (request.ParentId.HasValue)
            {
                var parent = await _tkRepos.GetAsync(request.ParentId.Value);
                if (parent != null)
                {
                    if (!request.SoTaiKhoan.StartsWith(parent.SoTaiKhoan))
                    {
                        throw new UserFriendlyException("Số tài khoản phải bắt đầu bằng tài khoản tổng hợp");
                    }
                }
            }

            var existAccount = _tkRepos.GetAll().FirstOrDefault(tk => tk.SoTaiKhoan == request.SoTaiKhoan);
            if (existAccount != null)
            {
                throw new UserFriendlyException("Số tài khoản đã tồn tại");
            }

            // Nếu request là update 
            if (request.Id > 0)
            {
                // Lấy thông tin tài khoản cũ 
                var tk = _tkRepos.Get(request.Id.Value);
                if (tk != null)
                {
                    // Nếu thông tin tài khoản cũ có cha và không giống tài khoản mới 
                    if (tk.Parent?.Id != request.ParentId.Value)
                    {
                        // Nếu thông tin tài khoản cha cũ có 1 con thì set lại tk đó không là cha nữa 
                        if (tk.Parent.TotalChild == 1)
                        {
                            tk.Parent.TotalChild = 0;
                            tk.Parent.IsParent = false;
                        }

                        tk.Parent = null;
                    }

                    // Nếu thông tin tài khoản mới có tài khoản cha 
                    if (request.ParentId.HasValue)
                    {
                        // Tăng số lượng con của tài khoản cha mới 
                        var newParent = _tkRepos.Get(request.ParentId.Value);
                        if (newParent != null)
                        {
                            newParent.IsParent = true;
                            newParent.TotalChild += 1;
                            tk.Parent = newParent;
                        }
                        _tkRepos.Update(newParent);

                    }

                    request.MapTo(tk);
                    _tkRepos.Update(tk);
                    return tk.Id;
                }
                else
                {
                    throw new UserFriendlyException("Id không hợp lệ");
                }
            }
            else
            {
                var insertInput = request.MapTo<DanhMucTaiKhoanEntity>();

                // Nếu thông tin tài khoản mới có tài khoản cha 
                if (request.ParentId.HasValue)
                {
                    // Tăng số lượng con của tài khoản cha mới 
                    var newParent = _tkRepos.Get(request.ParentId.Value);
                    if (newParent != null)
                    {
                        newParent.IsParent = true;
                        newParent.TotalChild += 1;
                    }
                    insertInput.Parent = newParent;
                    await _tkRepos.UpdateAsync(newParent);
                }

                return await _tkRepos.InsertAndGetIdAsync(insertInput);
            }
        }
    }


}
