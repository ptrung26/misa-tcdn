using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace newPSG.PMS.Entities
{
    [Table("DM_QuocTich")]
    public class DanhMucQuocTichEntity : FullAuditedEntity<int>, IPassivable
    {
        [MaxLength(200)]
        [Required]
        public string Name { get; set; }

        [Required]
        public string Alpha2Code { get; set; }

        [Required]
        public string Alpha3Code { get; set; }

        [Required]
        public int NumericCode { get; set; }

        public bool IsActive { get; set; }
    }
}