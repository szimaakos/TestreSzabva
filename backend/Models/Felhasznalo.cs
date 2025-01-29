using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TestreSzabva.Models
{
    public class Felhasznalo : IdentityUser
    {
        [Required]
        [Range(1, 500)]
        public float Weight { get; set; }

        [Required]
        [Range(50, 300)]
        public float Height { get; set; }

        [Required]
        [Range(0, 200)]
        public int Age { get; set; }

        [Required]
        public string Gender { get; set; } // "Férfi"/"Nő", de tetszőlegesen bővíthető

        [Required]
        public string ActivityLevel { get; set; } // "Alacsony"/"Közepes"/"Magas" stb.

        [Required]
        [Range(1, 500)]
        public float GoalWeight { get; set; }

        // Navigációs tulajdonság
        public ICollection<HetiEtrend> HetiEtrendek { get; set; } = new List<HetiEtrend>();
    }
}
