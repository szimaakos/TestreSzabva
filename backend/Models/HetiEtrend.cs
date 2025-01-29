using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestreSzabva.Models
{
    public class HetiEtrend
    {
        [Key]
        public int PlanId { get; set; }

        [Required]
        public string UserId { get; set; } // IdentityUser.Id (string)

        [ForeignKey("UserId")]
        public Felhasznalo Felhasznalo { get; set; }

        [Required]
        public string DayOfWeek { get; set; } // "Hétfő", "Kedd" stb.

        [Required]
        public string MealTime { get; set; } // "Reggeli", "Ebéd" stb.

        [Required]
        public int FoodId { get; set; }

        [ForeignKey("FoodId")]
        public Etel Etel { get; set; }

        [Required]
        [Range(1, 500)]
        public float Quantity { get; set; }

        [Required]
        public float TotalCalories { get; set; }
    }
}
