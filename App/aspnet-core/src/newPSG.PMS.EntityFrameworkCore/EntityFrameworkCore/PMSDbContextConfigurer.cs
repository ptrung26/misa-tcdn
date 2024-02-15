using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace newPSG.PMS.EntityFrameworkCore
{
    public static class PMSDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<PMSDbContext> builder, string connectionString)
        {
            // builder.UseSqlServer(connectionString);
            builder.UseMySql(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<PMSDbContext> builder, DbConnection connection)
        {
            // builder.UseSqlServer(connection);
            builder.UseMySql(connection);
        }
    }
}