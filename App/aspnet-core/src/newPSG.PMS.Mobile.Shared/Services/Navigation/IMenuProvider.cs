using System.Collections.Generic;
using MvvmHelpers;
using newPSG.PMS.Models.NavigationMenu;

namespace newPSG.PMS.Services.Navigation
{
    public interface IMenuProvider
    {
        ObservableRangeCollection<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions);
    }
}