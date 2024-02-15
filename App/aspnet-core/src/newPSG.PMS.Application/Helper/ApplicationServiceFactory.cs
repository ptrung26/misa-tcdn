using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Runtime.Caching;
using AutoMapper;
using newPSG.PMS.AppManager;
using SqlKata.Compilers;
using SqlKata.Execution;
using System;
using System.Collections.Generic;

namespace newPSG.PMS.Helper
{
    public class ApplicationServiceFactory : IApplicationServiceFactory
    {
        private readonly IIocResolver _iocResolver;
        public ApplicationServiceFactory(IIocResolver iocResolver)
        {
            _iocResolver = iocResolver;
        }

        private IScopedIocResolver _scope;
        private IScopedIocResolver Scope => _scope ?? (_scope = _iocResolver.CreateScope());

        private IUnitOfWorkDapper _dapper;
        public IUnitOfWorkDapper UnitOfWorkDapper => _dapper ?? (_dapper = Scope.Resolve<IUnitOfWorkDapper>());

        private ICacheManager _cache;
        public ICacheManager CacheManager => _cache ?? (_cache = Scope.Resolve<ICacheManager>());

        private IMapper _mapper;
        public  IMapper Mapper => _mapper ?? (_mapper = Scope.Resolve<IMapper>());

        #region Repository
        private Dictionary<Type, object> _repositories;
        public IRepository<TEntity,TPrimaryKey> Repository<TEntity, TPrimaryKey>() where TEntity : class, Abp.Domain.Entities.IEntity<TPrimaryKey>
        {
            if (_repositories == null) _repositories = new Dictionary<Type, object>();
            var type = typeof(TEntity);
            if (!_repositories.ContainsKey(type))
            {
                _repositories[type] = Scope.Resolve<IRepository<TEntity, TPrimaryKey>>();
            }
            return (IRepository<TEntity, TPrimaryKey>)_repositories[type];
        }


        #endregion


        #region Dispose

        private bool _disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;
            _scope?.Dispose();
            _disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        #endregion


        private QueryFactory _queryFactory;
        public QueryFactory QueryFactory
        {
            get
            {
                if (_queryFactory != null) return _queryFactory;
                var connection = this.UnitOfWorkDapper.Connection;
                var compiler = new MySqlCompiler();
                _queryFactory = new QueryFactory(connection, compiler);
                return _queryFactory;

            }
        }

    }

}
