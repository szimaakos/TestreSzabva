using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Felhasznalo : IdentityUser
    {
        public float? Weight { get; set; }
        public float? Height { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? ActivityLevel { get; set; }
        public float? GoalWeight { get; set; }

        // Új mezők:
        public DateTime? GoalDate { get; set; }  // A dátum, amire a célsúlyt el szeretné érni
        public float? CalorieGoal { get; set; }  // A felhasználó adatai alapján kiszámított kalória cél

        public bool IsProfileComplete { get; set; } = false;

        // Navigációs tulajdonság
        public ICollection<HetiEtrend> HetiEtrendek { get; set; } = new List<HetiEtrend>();
    }
}