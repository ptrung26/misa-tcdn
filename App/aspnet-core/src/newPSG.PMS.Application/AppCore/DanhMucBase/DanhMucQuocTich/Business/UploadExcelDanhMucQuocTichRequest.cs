using Abp.Domain.Repositories;
using MediatR;
using newPSG.PMS.AppCore.DanhMucBase.DanhMucQuocTich.Dto;
using newPSG.PMS.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.AppCore.DanhMucBase.DanhMucQuocTich.Business
{
    public class UploadExcelDanhMucQuocTichRequest : IRequest
    {
        public List<DanhMucQuocTichDto> ListQuocGia { get; set; }
    }

    public class UploadExcelDanhMucQuocTichHandle : BusinessRequestHandlerBase, IRequestHandler<UploadExcelDanhMucQuocTichRequest>
    {
        private readonly IRepository<DanhMucQuocTichEntity> _repos;

        public UploadExcelDanhMucQuocTichHandle(IRepository<DanhMucQuocTichEntity> repos)
        {
            _repos = repos;
        }

        public async Task<Unit> Handle(UploadExcelDanhMucQuocTichRequest request, CancellationToken cancellationToken)
        {
            foreach (var item in request.ListQuocGia)
            {
                item.IsActive = true;
                var insert = ObjectMapper.Map<DanhMucQuocTichEntity>(item);
                await _repos.InsertAsync(insert);
            }
            return await Task.FromResult(Unit.Value);
        }
    }
}