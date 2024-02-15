using Abp.Domain.Repositories;
using Abp.Runtime.Caching;
using AutoMapper;
using MediatR;
using newPSG.PMS.DanhMucXa.Dto;
using newPSG.PMS.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.DanhMucXa.HandlerQuery
{
    public class DanhMucXaInsertOrUpdateQuery : DanhMucXaDto, IRequest
    {
    }

    public class InsertOrUpdateQueryHandler : IRequestHandler<DanhMucXaInsertOrUpdateQuery>
    {
        private readonly IRepository<DanhMucXaEntity> _xaRepos;
        private readonly IRepository<DanhMucHuyenEntity> _huyenRepos;
        private readonly IRepository<DanhMucTinhEntity> _tinhRepos;
        private readonly IMapper _mapper;
        private readonly ICache _cache;

        public InsertOrUpdateQueryHandler(IRepository<DanhMucXaEntity> xaRepos,
            IRepository<DanhMucHuyenEntity> huyenRepos,
             IRepository<DanhMucTinhEntity> tinhRepos,
            IMapper mapper,
            ICacheManager cache)
        {
            _mapper = mapper;
            _cache = cache.GetCache("DanhMucXa");
            _xaRepos = xaRepos;
            _huyenRepos = huyenRepos;
            _tinhRepos = tinhRepos;
        }

        public async Task<Unit> Handle(DanhMucXaInsertOrUpdateQuery input, CancellationToken cancellationToken)
        {
            try
            {
                if (input.Id > 0)
                {
                    var @update = await _xaRepos.GetAsync(input.Id);
                    input.TenHuyen = (await _huyenRepos.FirstOrDefaultAsync(x => x.MaHuyen == input.MaHuyen)).TenHuyen;
                    input.TenTinh = (await _huyenRepos.FirstOrDefaultAsync(x => x.MaHuyen == input.MaHuyen)).TenTinh;
                    _mapper.Map(input, @update);
                    await _xaRepos.UpdateAsync(@update);
                }
                else
                {
                    input.TenHuyen = (await _huyenRepos.FirstOrDefaultAsync(x => x.MaHuyen == input.MaHuyen)).TenHuyen;
                    input.TenTinh = (await _tinhRepos.FirstOrDefaultAsync(x => x.MaTinh == input.MaTinh)).TenTinh;
                    var @insert = _mapper.Map<DanhMucXaEntity>(input);

                    await _xaRepos.InsertAsync(@insert);
                }
                await _cache.ClearAsync();
                return await Task.FromResult(Unit.Value);
            }
            catch (System.Exception ex)
            {
                throw;
            }
        }
    }
}