using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class CreateFoodDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public float Calories { get; set; }

        public float? Protein { get; set; }
        public float? Carbs { get; set; }
        public float? Fats { get; set; }

        // Ezek a kategória azonosítók, amelyeket a WPF ListBoxból küldünk
        public List<int> CategoryIds { get; set; } = new List<int>();
    }
}