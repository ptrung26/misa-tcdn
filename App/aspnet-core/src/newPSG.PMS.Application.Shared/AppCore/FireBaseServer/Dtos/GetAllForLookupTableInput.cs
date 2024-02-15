using Abp.Application.Services.Dto;

namespace newPSG.PMS.FireBaseServer.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
		public string Filter { get; set; }
    }
}