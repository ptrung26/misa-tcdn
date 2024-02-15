using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace newPSG.PMS
{
    [DependsOn(typeof(PMSClientModule), typeof(AbpAutoMapperModule))]
    public class PMSXamarinSharedModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Localization.IsEnabled = false;
            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PMSXamarinSharedModule).GetAssembly());
        }
    }
}