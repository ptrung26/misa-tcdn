using System;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;

namespace newPSG.PMS.Storage
{
    public class DbBinaryObjectManager : IBinaryObjectManager, ITransientDependency
    {
        private IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<BinaryObject, Guid> _binaryObjectRepository;

        public DbBinaryObjectManager(IRepository<BinaryObject, Guid> binaryObjectRepository, IUnitOfWorkManager unitOfWorkManager)
        {
            _binaryObjectRepository = binaryObjectRepository;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public Task<BinaryObject> GetOrNullAsync(Guid id)
        {
            using (_unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                return _binaryObjectRepository.FirstOrDefaultAsync(id);
            }
        }

        public Task SaveAsync(BinaryObject file)
        {
            return _binaryObjectRepository.InsertAsync(file);
        }

        public Task DeleteAsync(Guid id)
        {
            return _binaryObjectRepository.DeleteAsync(id);
        }
    }
}