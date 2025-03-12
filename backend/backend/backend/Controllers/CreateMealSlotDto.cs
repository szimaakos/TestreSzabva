using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class CreateMealSlotDto
{
    [Required]
    public string UserId { get; set; }

    [Required]
    public string DayOfWeek { get; set; }

    [Required]
    public string MealTime { get; set; }

    public List<CreateMealFoodDto> MealFoods { get; set; } = new List<CreateMealFoodDto>();
}

public class CreateMealFoodDto
{
    [Required]
    public int FoodId { get; set; }

    [Required]
    [Range(1, 500)]
    public float Quantity { get; set; }

    [Required]
    public float TotalCalories { get; set; }
}