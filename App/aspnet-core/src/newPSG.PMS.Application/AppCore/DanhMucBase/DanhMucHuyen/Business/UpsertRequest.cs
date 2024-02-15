using Abp.AutoMapper;
using Abp.Domain.Repositories;
using MediatR;
using newPSG.PMS.Dto;
using newPSG.PMS.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucHuyenManagement.Business
{
    public class DanhMucHuyenUpsertRequest : DanhMucHuyenDto, IRequest<int>
    {
    }

    [Obsolete]
    public class UpsertRequestHandler : IRequestHandler<DanhMucHuyenUpsertRequest, int>
    {
        private readonly IRepository<DanhMucTinhEntity, int> _tinhRepos;
        private readonly IRepository<DanhMucHuyenEntity, int> _huyenRepos;

        public UpsertRequestHandler(IRepository<DanhMucTinhEntity, int> tinhRepos, IRepository<DanhMucHuyenEntity, int> huyenRepos)
        {
            _tinhRepos = tinhRepos;
            _huyenRepos = huyenRepos;
        }

        public async Task<int> Handle(DanhMucHuyenUpsertRequest input, CancellationToken cancellationToken)
        {
            var tinh = await _tinhRepos.FirstOrDefaultAsync(x => x.MaTinh == input.MaTinh);
            if (tinh != null)
                input.TenTinh = tinh.TenTinh;
            if (input.Id > 0)
            {
                // update
                var updateData = await _huyenRepos.GetAsync(input.Id.Value);
                input.MapTo(updateData);
                await _huyenRepos.UpdateAsync(updateData);
                return updateData.Id;
            }
            else
            {
                var insertInput = input.MapTo<DanhMucHuyenEntity>();
                return await _huyenRepos.InsertAndGetIdAsync(insertInput);
            }
        }
    }
}