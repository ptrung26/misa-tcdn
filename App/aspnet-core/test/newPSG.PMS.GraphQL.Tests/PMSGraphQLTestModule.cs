using Abp.Modules;
using Abp.Reflection.Extensions;
using Castle.Windsor.MsDependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using newPSG.PMS.Configure;
using newPSG.PMS.Startup;
using newPSG.PMS.Test.Base;

namespace newPSG.PMS.GraphQL.Tests
{
    [DependsOn(
        typeof(PMSGraphQLModule),
        typeof(PMSTestBaseModule))]
    public class PMSGraphQLTestModule : AbpModule
    {
        public override void PreInitialize()
        {
            IServiceCollection services = new ServiceCollection();
            
            services.AddAndConfigureGraphQL();

            WindsorRegistrationHelper.CreateServiceProvider(IocManager.IocContainer, services);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(PMSGraphQLTestModule).GetAssembly());
        }
    }
}