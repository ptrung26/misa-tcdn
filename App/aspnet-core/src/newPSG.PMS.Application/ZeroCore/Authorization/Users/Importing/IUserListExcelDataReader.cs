using System.Collections.Generic;
using newPSG.PMS.Authorization.Users.Importing.Dto;
using Abp.Dependency;

namespace newPSG.PMS.Authorization.Users.Importing
{
    public interface IUserListExcelDataReader: ITransientDependency
    {
        List<ImportUserDto> GetUsersFromExcel(byte[] fileBytes);
    }
}
