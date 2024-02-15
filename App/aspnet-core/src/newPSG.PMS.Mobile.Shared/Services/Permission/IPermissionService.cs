namespace newPSG.PMS.Services.Permission
{
    public interface IPermissionService
    {
        bool HasPermission(string key);
    }
}