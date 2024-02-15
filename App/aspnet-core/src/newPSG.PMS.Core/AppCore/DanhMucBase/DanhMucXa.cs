using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace newPSG.PMS.Entities
{
    [Table("DM_Xa")]
    public class DanhMucXaEntity: FullAuditedEntity<int>
    {
        [Required]
        [MaxLength(10)]
        public string MaXa { get; set; }
        [Required]
        [MaxLength(200)]
        public string TenXa { get; set; }
        [Required]
        [MaxLength(10)]
        public string MaTinh { get; set; }
        [Required]
        [MaxLength(200)]
        public string TenTinh { get; set; }
        [Required]
        [MaxLength(10)]
        public string MaHuyen { get; set; }
        [Required]
        [MaxLength(200)]
        public string TenHuyen { get; set; }
        [MaxLength(200)]
        public string Cap { get; set; }
    }
}
