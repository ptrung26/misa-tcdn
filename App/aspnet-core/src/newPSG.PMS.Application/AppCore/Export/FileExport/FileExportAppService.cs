using Abp.Application.Services;
using newPSG.PMS.Storage;

namespace newPSG.PMS.Export.Services
{
    #region INTERFACE

    public interface IFileExportAppService : IApplicationService
    {
        byte[] GetFile(string token);
    }

    #endregion INTERFACE

    #region MAIN

    public class FileExportAppService : PMSAppServiceBase, IFileExportAppService
    {
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public FileExportAppService(ITempFileCacheManager tempFileCacheManager)
        {
            _tempFileCacheManager = tempFileCacheManager;
        }

        public byte[] GetFile(string token)
        {
            return _tempFileCacheManager.GetFile(token);
        }
    }

    #endregion MAIN
}