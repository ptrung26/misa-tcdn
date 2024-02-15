using System.Threading.Tasks;
using newPSG.PMS.Views;
using Xamarin.Forms;

namespace newPSG.PMS.Services.Modal
{
    public interface IModalService
    {
        Task ShowModalAsync(Page page);

        Task ShowModalAsync<TView>(object navigationParameter) where TView : IXamarinView;

        Task<Page> CloseModalAsync();
    }
}
