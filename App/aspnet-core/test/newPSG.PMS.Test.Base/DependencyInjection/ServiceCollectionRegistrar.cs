using System.Reflection;
using Abp.Dependency;
using Castle.MicroKernel.Registration;
using Castle.Windsor.MsDependencyInjection;
using MediatR;
using MediatR.Pipeline;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using newPSG.PMS.AppManager;
using newPSG.PMS.EntityFrameworkCore;
using newPSG.PMS.Helper;
using newPSG.PMS.Identity;

namespace newPSG.PMS.Test.Base.DependencyInjection
{
    public static class ServiceCollectionRegistrar
    {
        public static void Register(IIocManager iocManager)
        {
            RegisterIdentity(iocManager);

            var builder = new DbContextOptionsBuilder<PMSDbContext>();

            var inMemorySqlite = new SqliteConnection("Data Source=:memory:");
            builder.UseSqlite(inMemorySqlite);

            iocManager.IocContainer.Register(
                Component
                    .For<DbContextOptions<PMSDbContext>>()
                    .Instance(builder.Options)
                    .LifestyleSingleton()
            );

            inMemorySqlite.Open();

            new PMSDbContext(builder.Options).Database.EnsureCreated();
        }

        private static void RegisterIdentity(IIocManager iocManager)
        {
            var services = new ServiceCollection();

            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>));
            services.AddMediatR(typeof(PMSAppServiceBase).Assembly);

            services.AddScoped<IApplicationServiceFactory, ApplicationServiceFactory>();
            services.AddScoped<IUnitOfWorkDapper, UnitOfWorkDapper>(
                x=> new UnitOfWorkDapper("server=118.70.182.107;port=13306;uid=ATTP;pwd=123456;database=nutifood_dev")
                );

            IdentityRegistrar.Register(services);

            WindsorRegistrationHelper.CreateServiceProvider(iocManager.IocContainer, services);
        }
    }
}
