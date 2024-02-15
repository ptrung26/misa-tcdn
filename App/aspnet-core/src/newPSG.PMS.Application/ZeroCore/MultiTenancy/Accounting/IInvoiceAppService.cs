using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using newPSG.PMS.MultiTenancy.Accounting.Dto;

namespace newPSG.PMS.MultiTenancy.Accounting
{
    public interface IInvoiceAppService
    {
        Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

        Task CreateInvoice(CreateInvoiceDto input);
    }
}
