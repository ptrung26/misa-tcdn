using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using newPSG.PMS.Dto;
using newPSG.PMS.FireBaseServer.Dtos;

namespace newPSG.PMS.FireBaseServer
{
    public interface IUserFireBaseTokensAppService : IApplicationService 
    {
        Task<PagedResultDto<GetUserFireBaseTokenForViewDto>> GetAll(GetAllUserFireBaseTokensInput input);

        Task<GetUserFireBaseTokenForViewDto> GetUserFireBaseTokenForView(long id);

        Task<bool> NotifyAsync(string to, string title, string body);

        Task<GetUserFireBaseTokenForEditOutput> GetUserFireBaseTokenForEdit(EntityDto<long> input);

		Task CreateOrEdit(CreateOrEditUserFireBaseTokenDto input);

		Task Delete(EntityDto<long> input);

		
    }
}