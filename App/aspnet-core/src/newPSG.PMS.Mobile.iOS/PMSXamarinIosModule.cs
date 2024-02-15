using Abp.Modules;
using Abp.Reflection.Extensions;

namespace newPSG.PMS
{
    [DependsOn(typeof(PMSXamarinSharedModule))]
    public class PMSXamarinIosModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PMSXamarinIosModule).GetAssembly());
        }
    }
}