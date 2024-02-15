using Abp.Modules;
using Abp.Reflection.Extensions;

namespace newPSG.PMS
{
    [DependsOn(typeof(PMSCoreSharedModule))]
    public class PMSApplicationSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PMSApplicationSharedModule).GetAssembly());
        }
    }
}