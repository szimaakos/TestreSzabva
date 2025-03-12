using System.ComponentModel.DataAnnotations;

public class CreateHetiEtrendDto
{
    [Required]
    public string UserId { get; set; }

    [Required]
    public string DayOfWeek { get; set; }

    [Required]
    public string MealTime { get; set; }

    [Required]
    public int FoodId { get; set; }

    [Required]
    [Range(1, 500)]
    public float Quantity { get; set; }

    [Required]
    public float TotalCalories { get; set; }
}