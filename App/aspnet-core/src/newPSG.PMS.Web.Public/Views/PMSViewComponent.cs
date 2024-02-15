using Abp.AspNetCore.Mvc.ViewComponents;

namespace newPSG.PMS.Web.Public.Views
{
    public abstract class PMSViewComponent : AbpViewComponent
    {
        protected PMSViewComponent()
        {
            LocalizationSourceName = PMSConsts.LocalizationSourceName;
        }
    }
}