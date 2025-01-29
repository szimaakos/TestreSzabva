using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TestreSzabva.Models
{
    public class Kategoria
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        public string Name { get; set; }

        // Navigációs tulajdonság
        public ICollection<EtelKategoria> EtelKategoriak { get; set; } = new List<EtelKategoria>();
    }
}
