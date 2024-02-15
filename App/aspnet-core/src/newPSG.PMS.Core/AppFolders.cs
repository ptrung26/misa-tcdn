using Abp.Dependency;

namespace newPSG.PMS
{
    public class AppFolders : IAppFolders, ISingletonDependency
    {
        public string SampleProfileImagesFolder { get; set; }
        public string Images { get; set; }
        public string Template { get; set; }
        public string Fonts { get; set; }

        public string WebLogsFolder { get; set; }
    }
}