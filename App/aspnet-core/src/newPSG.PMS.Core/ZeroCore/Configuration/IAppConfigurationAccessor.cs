using Microsoft.Extensions.Configuration;

namespace newPSG.PMS.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
