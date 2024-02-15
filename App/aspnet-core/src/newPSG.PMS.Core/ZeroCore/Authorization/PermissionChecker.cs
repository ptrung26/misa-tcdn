using Abp.Authorization;
using newPSG.PMS.Authorization.Roles;
using newPSG.PMS.Authorization.Users;

namespace newPSG.PMS.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
