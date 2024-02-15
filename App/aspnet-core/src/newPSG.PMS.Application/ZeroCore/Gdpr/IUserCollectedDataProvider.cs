using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using newPSG.PMS.Dto;

namespace newPSG.PMS.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}
