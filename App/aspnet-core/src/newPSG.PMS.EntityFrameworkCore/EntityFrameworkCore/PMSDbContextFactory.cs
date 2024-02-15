using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using newPSG.PMS.Configuration;
using newPSG.PMS.Web;

namespace newPSG.PMS.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class PMSDbContextFactory : IDesignTimeDbContextFactory<PMSDbContext>
    {
        public PMSDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<PMSDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder(), addUserSecrets: true);

            PMSDbContextConfigurer.Configure(builder, configuration.GetConnectionString(PMSConsts.ConnectionStringName));

            return new PMSDbContext(builder.Options);
        }
    }
}