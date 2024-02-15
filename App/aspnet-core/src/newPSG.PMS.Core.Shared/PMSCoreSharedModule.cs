using Abp.Modules;
using Abp.Reflection.Extensions;

namespace newPSG.PMS
{
    public class PMSCoreSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PMSCoreSharedModule).GetAssembly());
        }
    }
}