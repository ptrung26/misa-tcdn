using Abp.Domain.Repositories;
using Abp.Runtime.Caching;
using AutoMapper;
using newPSG.PMS.AppManager;
using SqlKata.Execution;
using System;

namespace newPSG.PMS.Helper
{
    public interface IApplicationServiceFactory : IDisposable
    {
        IUnitOfWorkDapper UnitOfWorkDapper { get; }
        ICacheManager CacheManager { get; }
        IMapper Mapper { get; }
        IRepository<TEntity, TPrimaryKey> Repository<TEntity, TPrimaryKey>() where TEntity : class, Abp.Domain.Entities.IEntity<TPrimaryKey>;
        QueryFactory QueryFactory { get; }

    }
}
