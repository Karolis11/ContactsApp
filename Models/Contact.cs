namespace MyApi.Models
{
    public class Contact
    {
        public int Id { get; set; }  // EF will treat this as the primary key
        public int UserId { get; set; }  // Foreign key to User
        required public string Name { get; set; }
        required public string Email { get; set; }
    }
}
