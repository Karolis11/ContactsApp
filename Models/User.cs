namespace MyApi.Models
{
    public class User
    {
        public int Id { get; set; }  // EF will treat this as the primary key
        required public string Username { get; set; }
        required public string Password { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}