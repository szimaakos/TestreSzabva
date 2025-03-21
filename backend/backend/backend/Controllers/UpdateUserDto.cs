public class UpdateUserDto
{
    public string Id { get; set; }
    public float? Weight { get; set; }
    public float? Height { get; set; }
    public int? Age { get; set; }
    public string Gender { get; set; }
    public string ActivityLevel { get; set; }
    public float? GoalWeight { get; set; }
    public DateTime? GoalDate { get; set; }
    public bool IsProfileComplete { get; set; }
}