using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.AspNetZeroCore.Net;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using Abp.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using newPSG.PMS.Authorization;
using newPSG.PMS.MultiTenancy;
using newPSG.PMS.Storage;
using newPSG.PMS.Web.Helpers;

namespace newPSG.PMS.Web.Controllers
{
    [AbpMvcAuthorize]
    public class TenantCustomizationController : PMSControllerBase
    {
        private readonly TenantManager _tenantManager;
        private readonly IBinaryObjectManager _binaryObjectManager;
        private readonly IAppFolders _appFolders;
        public TenantCustomizationController(
            TenantManager tenantManager,
            IAppFolders appFolders,
            IBinaryObjectManager binaryObjectManager)
        {
            _tenantManager = tenantManager;
            _appFolders = appFolders;
            _binaryObjectManager = binaryObjectManager;
        }

        [HttpPost]
        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Tenant_Settings)]
        public async Task<JsonResult> UploadLogo()
        {
            try
            {
                var logoFile = Request.Form.Files.First();

                //Check input
                if (logoFile == null)
                {
                    throw new UserFriendlyException(L("File_Empty_Error"));
                }

                if (logoFile.Length > 30720) //30KB
                {
                    throw new UserFriendlyException(L("File_SizeLimit_Error"));
                }

                byte[] fileBytes;
                using (var stream = logoFile.OpenReadStream())
                {
                    fileBytes = stream.GetAllBytes();
                }

                var imageFormat = ImageFormatHelper.GetRawImageFormat(fileBytes);
                if (!imageFormat.IsIn(ImageFormat.Jpeg, ImageFormat.Png, ImageFormat.Gif))
                {
                    throw new UserFriendlyException("File_Invalid_Type_Error");
                }

                var logoObject = new BinaryObject(AbpSession.GetTenantId(), fileBytes);
                await _binaryObjectManager.SaveAsync(logoObject);

                var tenant = await _tenantManager.GetByIdAsync(AbpSession.GetTenantId());
                tenant.LogoId = logoObject.Id;
                tenant.LogoFileType = logoFile.ContentType;

                return Json(new AjaxResponse(new { id = logoObject.Id, TenantId = tenant.Id, fileType = tenant.LogoFileType }));
            }
            catch (UserFriendlyException ex)
            {
                return Json(new AjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        [HttpPost]
        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Tenant_Settings)]
        public async Task<JsonResult> UploadCustomCss()
        {
            try
            {
                var cssFile = Request.Form.Files.First();

                //Check input
                if (cssFile == null)
                {
                    throw new UserFriendlyException(L("File_Empty_Error"));
                }

                if (cssFile.Length > 1048576) //1MB
                {
                    throw new UserFriendlyException(L("File_SizeLimit_Error"));
                }

                byte[] fileBytes;
                using (var stream = cssFile.OpenReadStream())
                {
                    fileBytes = stream.GetAllBytes();
                }

                var cssFileObject = new BinaryObject(AbpSession.GetTenantId(), fileBytes);
                await _binaryObjectManager.SaveAsync(cssFileObject);

                var tenant = await _tenantManager.GetByIdAsync(AbpSession.GetTenantId());
                tenant.CustomCssId = cssFileObject.Id;

                return Json(new AjaxResponse(new { id = cssFileObject.Id, TenantId = tenant.Id }));
            }
            catch (UserFriendlyException ex)
            {
                return Json(new AjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        [AllowAnonymous]
        public async Task<ActionResult> GetLogo(int? tenantId)
        {
            if (tenantId == null)
            {
                tenantId = AbpSession.TenantId;
            }
            if (!tenantId.HasValue)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            var tenant = await _tenantManager.FindByIdAsync(tenantId.Value);
            if (tenant == null || !tenant.HasLogo())
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            using (CurrentUnitOfWork.SetTenantId(tenantId.Value))
            {
                var logoObject = await _binaryObjectManager.GetOrNullAsync(tenant.LogoId.Value);
                if (logoObject == null)
                {
                    return StatusCode((int)HttpStatusCode.NotFound);
                }

                return File(logoObject.Bytes, tenant.LogoFileType);
            }
        }

        [AllowAnonymous]
        public async Task<ActionResult> GetTenantLogo(string skin, int? tenantId)
        {
            var defaultLogo = "/Common/Images/app-logo-on-" + skin + ".svg";

            if (tenantId == null)
            {
                return File(defaultLogo, MimeTypeNames.ImageSvgXml);
            }

            var tenant = await _tenantManager.FindByIdAsync(tenantId.Value);
            if (tenant == null || !tenant.HasLogo())
            {
                return File(defaultLogo, MimeTypeNames.ImageSvgXml);
            }

            using (CurrentUnitOfWork.SetTenantId(tenantId.Value))
            {
                var logoObject = await _binaryObjectManager.GetOrNullAsync(tenant.LogoId.Value);
                if (logoObject == null)
                {
                    return File(defaultLogo, MimeTypeNames.ImageSvgXml);
                }

                return File(logoObject.Bytes, tenant.LogoFileType);
            }
        }
        [DisableAuditing]
        [AllowAnonymous]
        public FileResult GetImgNutifood()
        {
            try
            {
                string templateAbsolutePath = Path.Combine(_appFolders.Images, "logo_nutifood-light.png");
                using (FileStream fileStream = new FileStream(templateAbsolutePath, FileMode.Open))
                {
                    return File(ReadFully(fileStream), MimeTypeNames.ImagePng);
                }
            }
            catch 
            {
                throw new Abp.UI.UserFriendlyException(200, "Lấy ảnh thất bại");
            }

        }
        private byte[] ReadFully(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }

        [AllowAnonymous]
        public async Task<ActionResult> GetCustomCss(int? tenantId)
        {
            if (tenantId == null)
            {
                tenantId = AbpSession.TenantId;
            }
            if (!tenantId.HasValue)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            var tenant = await _tenantManager.FindByIdAsync(tenantId.Value);
            if (tenant == null || !tenant.CustomCssId.HasValue)
            {
                return StatusCode((int)HttpStatusCode.NotFound);
            }

            using (CurrentUnitOfWork.SetTenantId(tenantId.Value))
            {
                var cssFileObject = await _binaryObjectManager.GetOrNullAsync(tenant.CustomCssId.Value);
                if (cssFileObject == null)
                {
                    return StatusCode((int)HttpStatusCode.NotFound);
                }

                return File(cssFileObject.Bytes, MimeTypeNames.TextCss);
            }
        }
    }
}