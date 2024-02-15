using Abp.Application.Services.Dto;
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
    public class DanhMucHuyenGetByIdRequest : EntityDto, IRequest<DanhMucHuyenDto>
    {
    }

    public class GetByIdRequestHandler : IRequestHandler<DanhMucHuyenGetByIdRequest, DanhMucHuyenDto>
    {
        private readonly IRepository<DanhMucHuyenEntity> _repos;

        public GetByIdRequestHandler(IRepository<DanhMucHuyenEntity> repos)
        {
            _repos = repos;
        }

        [Obsolete]
        public async Task<DanhMucHuyenDto> Handle(DanhMucHuyenGetByIdRequest request, CancellationToken cancellationToken)
        {
            var data = await _repos.FirstOrDefaultAsync(request.Id);
            return data.MapTo<DanhMucHuyenDto>();
        }
    }
}