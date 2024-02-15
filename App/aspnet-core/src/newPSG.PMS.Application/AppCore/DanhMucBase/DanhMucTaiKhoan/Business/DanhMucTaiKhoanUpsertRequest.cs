using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.UI;
using MediatR;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;
using System;
using System.Collections.Generic;
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
                }

                var insertInput = request.MapTo<DanhMucTaiKhoanEntity>();
                return await _tkRepos.InsertAndGetIdAsync(insertInput);
            }
        }
    }


}
