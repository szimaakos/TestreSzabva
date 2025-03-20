namespace backend.Controllers
{
    public class LoginDto
    {
        public string? UserName { get; set; }  
        public required string Email { get; set; }     
        public required string Password { get; set; }  
    }
}
