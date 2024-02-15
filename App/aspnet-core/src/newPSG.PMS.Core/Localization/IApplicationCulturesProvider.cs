using System.Globalization;

namespace newPSG.PMS.Localization
{
    public interface IApplicationCulturesProvider
    {
        CultureInfo[] GetAllCultures();
    }
}