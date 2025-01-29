using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TestreSzabva.Models
{
    public class Etel
    {
        [Key]
        public int FoodId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public float Calories { get; set; }

        public float? Protein { get; set; }
        public float? Carbs { get; set; }
        public float? Fats { get; set; }

        // Navigációs tulajdonságok
        public ICollection<EtelKategoria> EtelKategoriak { get; set; } = new List<EtelKategoria>();
        public ICollection<HetiEtrend> HetiEtrendek { get; set; } = new List<HetiEtrend>();
    }
}
