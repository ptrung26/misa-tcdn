using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.AppCore.FireBaseServer;
using newPSG.PMS.Dto;
using newPSG.PMS.FireBaseServer;
using newPSG.PMS.FireBaseServer.Dtos;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace newPSG.PMS.AppCore.API_Mobile.FireBaseServer
{
    public class UserFireBaseTokensAppService : PMSAppServiceBase, IUserFireBaseTokensAppService
    {
        private readonly IRepository<UserFireBaseToken, long> _userFireBaseTokenRepository;
        public UserFireBaseTokensAppService(IRepository<UserFireBaseToken, long> userFireBaseTokenRepository)
        {
            _userFireBaseTokenRepository = userFireBaseTokenRepository;

        }
        [AbpAuthorize]
        public async Task<PagedResultDto<GetUserFireBaseTokenForViewDto>> GetAll(GetAllUserFireBaseTokensInput input)
        {

            var filteredUserFireBaseTokens = _userFireBaseTokenRepository.GetAll()
                        .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => false || e.FireBaseToken.Contains(input.Filter) || e.Platform.Contains(input.Filter));


            var query = (from o in filteredUserFireBaseTokens
                         select new GetUserFireBaseTokenForViewDto()
                         {
                             UserFireBaseToken = new UserFireBaseTokenDto
                             {
                                 FireBaseToken = o.FireBaseToken,
                                 UserId = o.UserId,
                                 Platform = o.Platform,
                                 Id = o.Id
                             }
                         });

            var totalCount = await query.CountAsync();

            var userFireBaseTokens = await query
                .OrderBy(input.Sorting ?? "userFireBaseToken.id asc")
                .PageBy(input)
                .ToListAsync();

            return new PagedResultDto<GetUserFireBaseTokenForViewDto>(
                totalCount,
                userFireBaseTokens
            );
        }
        public async Task<bool> NotifyAsync(string to, string title, string body)
        {
            try
            {

                // Get the server key from FCM console
                var serverKey = string.Format("key={0}", "AAAAliL_SGQ:APA91bHtjHS6OMKZSxEOePcPLFdhQ0ClcvnIB51xqk3QizmmxBsaCrVH8miABUA4WeEv5Eu39Y_JNasloS07BbEJG9-cqwy48IJN9lih8R-usG1bvM_8velJTZU3EIbD2937Hynz-A5I");

                // Get the sender id from FCM console
                var senderId = string.Format("id={0}", ":APA91bFeoAXe4x1qRo_9yDQ8C8BJO1_eEve9dKaRpg5uh6xLViWA_xw1e8_uO8j2KMFWER_YdnXQyckW6WP85jbR7KstSq7QZeit-3OZjydhL8-hVyEAOratjNXYQ_P7K2O448YNoVJR");

                var data = new
                {
                    to, // Recipient device token
                    notification = new { title, body }
                };

                // Using Newtonsoft.Json
                var jsonBody = JsonConvert.SerializeObject(data);

                using (var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://fcm.googleapis.com/fcm/send"))
                {
                    httpRequest.Headers.TryAddWithoutValidation("Authorization", serverKey);
                    httpRequest.Headers.TryAddWithoutValidation("Sender", senderId);
                    httpRequest.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                    using (var httpClient = new HttpClient())
                    {
                        var result = await httpClient.SendAsync(httpRequest);

                        if (result.IsSuccessStatusCode)
                        {
                            return true;
                        }
                        else
                        {
                            // Use result.StatusCode to handle failure
                            // Your custom error handler here
                            //  _logger.LogError($"Error sending notification. Status Code: {result.StatusCode}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // _logger.LogError($"Exception thrown in Notify Service: {ex}");
                Console.WriteLine(ex.Message);
            }

            return false;
        }
        public async Task<GetUserFireBaseTokenForViewDto> GetUserFireBaseTokenForView(long id)
        {
            var userFireBaseToken = await _userFireBaseTokenRepository.GetAsync(id);

            var output = new GetUserFireBaseTokenForViewDto { UserFireBaseToken = ObjectMapper.Map<UserFireBaseTokenDto>(userFireBaseToken) };

            return output;
        }

        public async Task<GetUserFireBaseTokenForEditOutput> GetUserFireBaseTokenForEdit(EntityDto<long> input)
        {
            var userFireBaseToken = await _userFireBaseTokenRepository.FirstOrDefaultAsync(input.Id);

            var output = new GetUserFireBaseTokenForEditOutput { UserFireBaseToken = ObjectMapper.Map<CreateOrEditUserFireBaseTokenDto>(userFireBaseToken) };

            return output;
        }

        public async Task CreateOrEdit(CreateOrEditUserFireBaseTokenDto input)
        {
            try
            {
                if (input.Id == null || input.Id == 0)
                {
                    await Create(input);
                }
                else
                {
                    await Update(input);
                }
            }
            catch
            {
                throw new Abp.UI.UserFriendlyException(209, "Không thể khởi tạo FireBaseToken!");
            }
           
        }

        private async Task Create(CreateOrEditUserFireBaseTokenDto input)
        {
            var userFireBaseToken = ObjectMapper.Map<UserFireBaseToken>(input);



            await _userFireBaseTokenRepository.InsertAsync(userFireBaseToken);
        }

        private async Task Update(CreateOrEditUserFireBaseTokenDto input)
        {
            var userFireBaseToken = await _userFireBaseTokenRepository.FirstOrDefaultAsync((long)input.Id);
            ObjectMapper.Map(input, userFireBaseToken);
        }

        public async Task Delete(EntityDto<long> input)
        {
            await _userFireBaseTokenRepository.DeleteAsync(input.Id);
        }
        public async Task DelFireBaseUser(UserFireBaseTokenInput input)
        {
            var DelItem = _userFireBaseTokenRepository.GetAll().Where(p => p.FireBaseToken == input.FireBaseToken).ToList();
            foreach (var item in DelItem)
            {
                await _userFireBaseTokenRepository.DeleteAsync(item.Id);
            }
            // await _userFireBaseTokenRepository.DeleteAsync(input.Id);
        }
    }
}
