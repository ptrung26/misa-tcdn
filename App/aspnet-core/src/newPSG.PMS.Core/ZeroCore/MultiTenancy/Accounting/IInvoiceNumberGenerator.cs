using System.Threading.Tasks;
using Abp.Dependency;

namespace newPSG.PMS.MultiTenancy.Accounting
{
    public interface IInvoiceNumberGenerator : ITransientDependency
    {
        Task<string> GetNewInvoiceNumber();
    }
}