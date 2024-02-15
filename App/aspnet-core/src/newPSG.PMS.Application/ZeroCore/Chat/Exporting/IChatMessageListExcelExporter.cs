using System.Collections.Generic;
using Abp;
using newPSG.PMS.Chat.Dto;
using newPSG.PMS.Dto;

namespace newPSG.PMS.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
    }
}
