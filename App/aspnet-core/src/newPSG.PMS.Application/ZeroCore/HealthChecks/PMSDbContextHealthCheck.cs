using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using newPSG.PMS.EntityFrameworkCore;

namespace newPSG.PMS.HealthChecks
{
    public class PMSDbContextHealthCheck : IHealthCheck
    {
        private readonly DatabaseCheckHelper _checkHelper;

        public PMSDbContextHealthCheck(DatabaseCheckHelper checkHelper)
        {
            _checkHelper = checkHelper;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            if (_checkHelper.Exist("db"))
            {
                return Task.FromResult(HealthCheckResult.Healthy("PMSDbContext connected to database."));
            }

            return Task.FromResult(HealthCheckResult.Unhealthy("PMSDbContext could not connect to database"));
        }
    }
}
