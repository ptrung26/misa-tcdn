using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Runtime.Caching;
using Microsoft.Extensions.DependencyInjection;
using newPSG.PMS.AppManager;
using newPSG.PMS.Entities;
using System;

namespace newPSG.PMS
{
    public class AppBusinessBase
    {
        public IServiceProvider ServiceProvider { get; set; }
        protected readonly object ServiceProviderLock = new object();

        protected TService LazyGetRequiredService<TService>(ref TService reference)
            => LazyGetRequiredService(typeof(TService), ref reference);

        protected TRef LazyGetRequiredService<TRef>(Type serviceType, ref TRef reference)
        {
            if (reference == null)
            {
                lock (ServiceProviderLock)
                {
                    if (reference == null)
                    {
                        reference = (TRef)ServiceProvider.GetRequiredService(serviceType);
                    }
                }
            }

            return reference;
        }

        public IUnitOfWorkManager UnitOfWorkManager => LazyGetRequiredService(ref _unitOfWorkManager);
        private IUnitOfWorkManager _unitOfWorkManager;
        protected IActiveUnitOfWork CurrentUnitOfWork => UnitOfWorkManager?.Current;

        private IUnitOfWorkDapper _dapper;
        public IUnitOfWorkDapper Dapper => LazyGetRequiredService(ref _dapper);

        private ICacheManager _cache;
        public ICacheManager CacheManager => LazyGetRequiredService(ref _cache);

        #region IRepository

        private IRepository<DanhMucTinhEntity> _tinhRepository;
        public IRepository<DanhMucTinhEntity> TinhRepository => LazyGetRequiredService(ref _tinhRepository);

        private IRepository<DanhMucHuyenEntity> _huyenRepository;
        public IRepository<DanhMucHuyenEntity> HuyenRepository => LazyGetRequiredService(ref _huyenRepository);

        private IRepository<DanhMucXaEntity> _xaRepository;
        public IRepository<DanhMucXaEntity> XaRepository => LazyGetRequiredService(ref _xaRepository);

        #endregion IRepository
    }
}