using Abp.Modules;
using Abp.Reflection.Extensions;

namespace newPSG.PMS
{
    public class PMSClientModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PMSClientModule).GetAssembly());
        }
    }
}
