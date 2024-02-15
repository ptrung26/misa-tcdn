using System.Collections.Generic;
using newPSG.PMS.Authorization.Users.Importing.Dto;
using newPSG.PMS.Dto;

namespace newPSG.PMS.Authorization.Users.Importing
{
    public interface IInvalidUserExporter
    {
        FileDto ExportToFile(List<ImportUserDto> userListDtos);
    }
}
