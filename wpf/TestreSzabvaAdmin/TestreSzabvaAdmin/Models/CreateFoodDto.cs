using System.Collections.Generic;

namespace TestreSzabvaAdmin.Models
{
    public class CreateFoodDto
    {
        public string Name { get; set; }
        public float Calories { get; set; }
        public float? Protein { get; set; }
        public float? Carbs { get; set; }
        public float? Fats { get; set; }
        public List<int> CategoryIds { get; set; } = new List<int>();
    }
}