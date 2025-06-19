namespace MyApi.Models
{
    public class User
    {
        public int Id { get; set; }
        required public string Username { get; set; }
        required public string Password { get; set; }
        required public string Email { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}