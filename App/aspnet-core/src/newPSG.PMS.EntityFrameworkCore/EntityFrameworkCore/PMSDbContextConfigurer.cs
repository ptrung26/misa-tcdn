using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace newPSG.PMS.EntityFrameworkCore
{
    public static class PMSDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<PMSDbContext> builder, string connectionString)
        {
            // builder.UseSqlServer(connectionString);
            builder.UseMySql(connectionString);
            builder.UseLoggerFactory(LoggerFactory.Create(__buider => __buider.AddConsole()));
        }

        public static void Configure(DbContextOptionsBuilder<PMSDbContext> builder, DbConnection connection)
        {
            // builder.UseSqlServer(connection);
            builder.UseMySql(connection);
        }
    }
}