namespace TestreSzabva.Controllers
{
    public class RegisterDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }

        public float Weight { get; set; }
        public float Height { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string ActivityLevel { get; set; }
        public float GoalWeight { get; set; }

        public string Password { get; set; }  // A nyers jelszó a regisztrációhoz
    }
}
