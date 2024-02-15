using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace newPSG.PMS.Configuration.Dto
{
    public class CHTDTuyChinhSetting
    {
        [Required]
        public CauHinhThucDonTESettingsEditDto CauHinhThucDonTE { get; set; }
        [Required]
        public CauHinhThucDonTEACSettingsEditDto CauHinhThucDonTEAC { get; set; }
        [Required]
        public CauHinhThucDonTSSSettingsEditDto CauHinhThucDonTSS { get; set; }
    }

    public class UpdateCHTDTuyChinhSetting
    {
        [Required]
        public UpdateCauHinhThucDonTESettingsEditDto CauHinhThucDonTE { get; set; }
        [Required]
        public UpdateCauHinhThucDonTEACSettingsEditDto CauHinhThucDonTEAC { get; set; }

        [Required]
        public UpdateCauHinhThucDonTSSSettingsEditDto CauHinhThucDonTSS { get; set; }
    }
}
