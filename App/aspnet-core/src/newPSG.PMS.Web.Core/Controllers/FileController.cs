using Abp.Auditing;
using Microsoft.AspNetCore.Mvc;
using newPSG.PMS.Dto;
using newPSG.PMS.Storage;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace newPSG.PMS.Web.Controllers
{
    public class FileController : PMSControllerBase
    {
        private readonly ITempFileCacheManager _tempFileCacheManager;
        private readonly IBinaryObjectManager _binaryObjectManager;

        public FileController(
            ITempFileCacheManager tempFileCacheManager,
            IBinaryObjectManager binaryObjectManager
        )
        {
            _tempFileCacheManager = tempFileCacheManager;
            _binaryObjectManager = binaryObjectManager;
        }

        [DisableAuditing]
        public ActionResult DownloadTempFile(FileDto file)
        {
            var fileBytes = _tempFileCacheManager.GetFile(file.FileToken);
            if (fileBytes == null)
            {
                return NotFound(L("RequestedFileDoesNotExists"));
            }

            return File(fileBytes, file.FileType, file.FileName);
        }

        [DisableAuditing]
        public ActionResult OpenTempFile(FileDto file)
        {
            var fileBytes = _tempFileCacheManager.GetFile(file.FileToken);
            if (fileBytes == null)
            {
                return NotFound(L("RequestedFileDoesNotExists"));
            }

            MemoryStream ms = new MemoryStream(fileBytes);
            return new FileStreamResult(ms, file.FileType);
        }

        [DisableAuditing]
        public async Task<ActionResult> DownloadBinaryFile(Guid id, string contentType, string fileName)
        {
            var fileObject = await _binaryObjectManager.GetOrNullAsync(id);
            if (fileObject == null)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            return File(fileObject.Bytes, contentType, fileName);
        }

        [DisableAuditing]
        public async Task<FileResult> GoToViewImage(Guid imgId, string contentType = "image/png")
        {
            try
            {
                var fileObject = await _binaryObjectManager.GetOrNullAsync(imgId);
                return File(fileObject.Bytes, contentType);
            }
            catch (Exception)
            {
                throw new Abp.UI.UserFriendlyException(200, "Lấy ảnh thất bại");
            }
        }
    }
}