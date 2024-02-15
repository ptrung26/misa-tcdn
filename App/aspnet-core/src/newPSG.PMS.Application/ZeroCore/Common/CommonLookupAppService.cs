using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.Common.Dto;
using newPSG.PMS.Editions;
using newPSG.PMS.Editions.Dto;
using newPSG.PMS.MultiTenancy;
using static newPSG.CommonEnum;

namespace newPSG.PMS.Common
{
    [AbpAuthorize]
    public class CommonLookupAppService : PMSAppServiceBase, ICommonLookupAppService
    {
        private readonly EditionManager _editionManager;
        private readonly IRepository<Tenant> _tenantRepository;

        public CommonLookupAppService(EditionManager editionManager, IRepository<Tenant> tenantRepository)
        {
            _editionManager = editionManager;
            _tenantRepository = tenantRepository;
        }

        public async Task<ListResultDto<SubscribableEditionComboboxItemDto>> GetEditionsForCombobox(bool onlyFreeItems = false)
        {
            var subscribableEditions = (await _editionManager.Editions.Cast<SubscribableEdition>().ToListAsync())
                .WhereIf(onlyFreeItems, e => e.IsFree)
                .OrderBy(e => e.MonthlyPrice);

            return new ListResultDto<SubscribableEditionComboboxItemDto>(
                subscribableEditions.Select(e => new SubscribableEditionComboboxItemDto(e.Id.ToString(), e.DisplayName, e.IsFree)).ToList()
            );
        }

        public async Task<PagedResultDto<NameValueDto>> FindUsers(FindUsersInput input)
        {
            if (AbpSession.TenantId != null)
            {
                //Prevent tenants to get other tenant's users.
                input.TenantId = AbpSession.TenantId;
            }

            using (CurrentUnitOfWork.SetTenantId(input.TenantId))
            {
                var query = UserManager.Users
                    .WhereIf(
                        !input.Filter.IsNullOrWhiteSpace(),
                        u =>
                            u.Name.Contains(input.Filter) ||
                            u.Surname.Contains(input.Filter) ||
                            u.UserName.Contains(input.Filter) ||
                            u.EmailAddress.Contains(input.Filter)
                    );

                var userCount = await query.CountAsync();
                var users = await query
                    .OrderBy(u => u.Name)
                    .ThenBy(u => u.Surname)
                    .PageBy(input)
                    .ToListAsync();

                return new PagedResultDto<NameValueDto>(
                    userCount,
                    users.Select(u =>
                        new NameValueDto(
                            u.FullName + " (" + u.EmailAddress + ")",
                            u.Id.ToString()
                            )
                        ).ToList()
                    );
            }
        }

        public GetDefaultEditionNameOutput GetDefaultEditionName()
        {
            return new GetDefaultEditionNameOutput
            {
                Name = EditionManager.DefaultEditionName
            };
        }
        public async Task<List<ItemObj<int>>> GetListCoSoKhamBenh()
        {
            var defaultData = new List<ItemObj<int>>();
            defaultData.Add(new ItemObj<int>
            {
                Id = -1,
                Name = "Hệ thống",
            });
            var res = await _tenantRepository.GetAll().Where(x=>x.IsActive == true).Select(x => new ItemObj<int>
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync();
            return defaultData.Concat(res).ToList();
        }


    }
}
