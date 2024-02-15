using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace newPSG.PMS.Web.Public.Views
{
    public abstract class PMSRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected PMSRazorPage()
        {
            LocalizationSourceName = PMSConsts.LocalizationSourceName;
        }
    }
}
