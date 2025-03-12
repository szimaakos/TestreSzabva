using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class HetiEtrend
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PlanId { get; set; }

    [Required]
    public string UserId { get; set; }

    [Required]
    public string DayOfWeek { get; set; }

    [Required]
    public string MealTime { get; set; }

    // Egy étkezési slot több ételt tartalmazhat:
    public ICollection<MealFood> MealFoods { get; set; } = new List<MealFood>();
}