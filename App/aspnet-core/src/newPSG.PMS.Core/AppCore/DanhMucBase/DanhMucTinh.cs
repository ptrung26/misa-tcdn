using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace newPSG.PMS.Entities
{
    [Table("DM_Tinh")]
    public class DanhMucTinhEntity: FullAuditedEntity<int>
    {
        [Required]
        [MaxLength(10)]
        public string MaTinh { get; set; }
        [Required]
        [MaxLength(200)]
        public string TenTinh { get; set; }
        [MaxLength(200)]
        public string Cap { get; set; }
    }
}
