using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Caching;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPSG.PMS.AppCore.API_Mobile._ResultApiBase.Dto;
using newPSG.PMS.AppCore.DanhMucBase.DanhMucQuocTich.Business;
using newPSG.PMS.AppCore.DanhMucBase.DanhMucQuocTich.Dto;
using newPSG.PMS.Entities;
using newPSG.PMS.Helper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace newPSG.PMS.AppCore.DanhMucBase.DanhMucQuocTich
{
    public interface IDanhMucQuocTichAppService: IApplicationService
    {
        Task<ReturnReponse<IEnumerable<ComboboxItemDto>>> ComboBoxData();
        Task<ReturnReponse<PagedResultDto<DanhMucQuocTichDto>>> PagingList(PagingListDanhMucQuocTichInput input);
        Task<ReturnReponse<long>> InsertOrUpdate(DanhMucQuocTichDto input);
        Task<ReturnReponse<long>> Delete(int id);
    }

    [AbpAuthorize]
    public class DanhMucQuocTichAppService : PMSAppServiceBase, IDanhMucQuocTichAppService
    {
        private readonly IApplicationServiceFactory _factory;
        private readonly IMediator _mediator;

        private IRepository<DanhMucQuocTichEntity, int> _quocTichRepos => _factory.Repository<DanhMucQuocTichEntity, int>();
        private ICacheManager _cache => _factory.CacheManager;
        public DanhMucQuocTichAppService(IApplicationServiceFactory factory, IMediator mediator)
        {
            _factory = factory;
            _mediator = mediator;
        }
        public async Task<ReturnReponse<IEnumerable<ComboboxItemDto>>> ComboBoxData()
        {
            var response = new ReturnReponse<IEnumerable<ComboboxItemDto>>();
            response.Error = new ErrorResponse();
            var dataCache = await _cache.GetCache("DanhMucQuocTich").GetOrDefaultAsync("ComboBox");
            if (dataCache != null)
            {
                response.Data = dataCache as IEnumerable<ComboboxItemDto>;
                return response;
            }
            var query = _quocTichRepos.GetAll().Where(x => x.IsActive == true).OrderBy(x => x.Name)
                                      .Select(x => new ComboboxItemDto
                                      {
                                          Value = x.NumericCode.ToString(),
                                          DisplayText = x.Name
                                      });
            var data = await query.ToListAsync();
            await _cache.GetCache("DanhMucQuocTich").SetAsync("ComboBox", data);
            response.Data = data;
            return response;
        }

        [HttpPost]
        public async Task<ReturnReponse<PagedResultDto<DanhMucQuocTichDto>>> PagingList(PagingListDanhMucQuocTichInput input)
        {
            var response = new ReturnReponse<PagedResultDto<DanhMucQuocTichDto>>();
            response.Error = new ErrorResponse();
            var query = _quocTichRepos.GetAll()
                                    .WhereIf(!string.IsNullOrEmpty(input.Filter), x => x.Name.Contains(input.Filter)
                                                                                || x.Alpha2Code.Contains(input.Filter)
                                                                                || x.Alpha3Code.Contains(input.Filter)
                                                                                || x.NumericCode.ToString() == input.Filter);
            int count = await query.CountAsync();
            var items = await query.OrderBy(input.Sorting ?? "name asc").PageBy(input).ToListAsync();
            List<DanhMucQuocTichDto> listDtos = ObjectMapper.Map<List<DanhMucQuocTichDto>>(items);
            response.Data = new PagedResultDto<DanhMucQuocTichDto>(count, listDtos);
            return response;
        }

        [HttpPost]
        public async Task<ReturnReponse<long>> InsertOrUpdate(DanhMucQuocTichDto input)
        {
            var response = new ReturnReponse<long>();
            response.Error = new ErrorResponse();
            try
            {
                if (input.Id > 0)
                {
                    DanhMucQuocTichEntity updateData = ObjectMapper.Map<DanhMucQuocTichEntity>(input);
                    await _quocTichRepos.UpdateAsync(updateData);
                }
                else
                {
                    DanhMucQuocTichEntity insertData = ObjectMapper.Map<DanhMucQuocTichEntity>(input);
                    await _quocTichRepos.InsertAsync(insertData);
                }
                await CurrentUnitOfWork.SaveChangesAsync();
                await _cache.GetCache("DanhMucQuocTich").ClearAsync();
                response.Data = input.Id;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Error = new ErrorResponse(201, ex.Message);
            }
            return response;
        }

        [HttpPost]
        public async Task<ReturnReponse<long>> Delete(int id)
        {
            var response = new ReturnReponse<long>();
            response.Error = new ErrorResponse();
            try
            {
                await _quocTichRepos.DeleteAsync(id);
                await CurrentUnitOfWork.SaveChangesAsync();
                await _cache.GetCache("DanhMucQuocTich").ClearAsync();
                response.Data = id;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Error = new ErrorResponse(201, ex.Message);
            }
            return response;
        }

        [HttpPost]
        public async Task<ReturnReponse<Unit>> UploadExcelDanhMucQuocTich(UploadExcelDanhMucQuocTichRequest input)
        {
            var response = new ReturnReponse<Unit>();
            var data = await _mediator.Send(input);
            response.Data = data;
            return response;
        }
    }
}
