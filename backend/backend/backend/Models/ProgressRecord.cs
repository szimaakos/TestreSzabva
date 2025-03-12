using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class ProgressRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public float Weight { get; set; }

        public float Calories { get; set; }

        [ForeignKey("UserId")]
        public Felhasznalo User { get; set; }
    }
}