namespace backend.Controllers
{
    public class RegisterDto
    {
        public string UserName { get; set; }  // kötelező
        public string Email { get; set; }     // kötelező
        public string Password { get; set; }  // kötelező

        // Töröljük innen: Weight, Height, Age, Gender, ActivityLevel, GoalWeight
        // Ezeket majd onboardingnál kapja meg a szerver
    }

}