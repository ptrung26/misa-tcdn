using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace newPSG.PMS.Startup
{
    [DependsOn(typeof(PMSCoreModule))]
    public class PMSGraphQLModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PMSGraphQLModule).GetAssembly());
        }

        public override void PreInitialize()
        {
            base.PreInitialize();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }
    }
}