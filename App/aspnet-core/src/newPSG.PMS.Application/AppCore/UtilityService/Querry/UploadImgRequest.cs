using Abp.Domain.Repositories;
using Abp.UI;
using MediatR;
using newPSG.PMS.Storage;
using System;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace newPSG.PMS.UtilityService.Business
{
    public class UploadImgRequest : IRequest<Guid>
    {
        [Required]
        [MaxLength(400)]
        public string FileToken { get; set; }

        //public int X { get; set; }

        //public int Y { get; set; }

        //public int Width { get; set; }

        //public int Height { get; set; }
    }

    public class UploadImgHandler : IRequestHandler<UploadImgRequest, Guid>
    {
        private const int MaxProfilPictureBytes = 5242880; //5MB
        private readonly IRepository<BinaryObject, Guid> _imgRepos;
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public UploadImgHandler(
            IRepository<BinaryObject, Guid> imgRepos,
            ITempFileCacheManager tempFileCacheManager)
        {
            _imgRepos = imgRepos;
            _tempFileCacheManager = tempFileCacheManager;
        }

        public async Task<Guid> Handle(UploadImgRequest request, CancellationToken cancellationToken)
        {
            var imgEntity = new BinaryObject
            {
                Bytes = GetImgByte(request),
                Id = Guid.NewGuid()
            };
            await _imgRepos.InsertAsync(imgEntity);
            return imgEntity.Id;
        }

        private byte[] GetImgByte(UploadImgRequest input)
        {
            byte[] byteArray;

            var imageBytes = _tempFileCacheManager.GetFile(input.FileToken);

            if (imageBytes == null)
            {
                throw new UserFriendlyException("There is no such image file with the token: " + input.FileToken);
            }

            using (var bmpImage = new Bitmap(new MemoryStream(imageBytes)))
            {
                //var width = (input.Width == 0 || input.Width > bmpImage.Width) ? bmpImage.Width : input.Width;
                //var height = (input.Height == 0 || input.Height > bmpImage.Height) ? bmpImage.Height : input.Height;
                //var bmCrop = bmpImage.Clone(new Rectangle(input.X, input.Y, width, height), bmpImage.PixelFormat);

                using (var stream = new MemoryStream())
                {
                    bmpImage.Save(stream, bmpImage.RawFormat);
                    byteArray = stream.ToArray();
                }
            }

            if (byteArray.Length > MaxProfilPictureBytes)
            {
                throw new UserFriendlyException("ResizedProfilePicture_Warn_SizeLimit");
            }
            return byteArray;
        }
    }
}