using Abp.Application.Services.Dto;
using newPSG.PMS.Utilities;

namespace newPSG.PMS.Dto
{
    public class PagedAndSortedInputDto : PagedInputDto, ISortedResultRequest
    {
        public string Sorting { get; set; }
        public PagedAndSortedInputDto()
        {
            MaxResultCount = AppConsts.DefaultPageSize;
        }
    }

    public class PagedFullInputDto : PagedAndSortedInputDto
    {
        public string Filter { get; set; }
        public string FilterFullText => $"%{Filter}%";
        public string MySqlFullTextSearch => string.IsNullOrEmpty(Filter) ? null : $"\"{Filter}\"";
        public void Format()
        {
            if (!string.IsNullOrEmpty(this.Filter))
            {
                this.Filter = this.Filter
                    .ToLower()
                    .Trim()
                    .Replace("  ", " ");
                this.Filter = StringHelperUtility.ConvertToUnsign(this.Filter);
            }
        }
    }
}