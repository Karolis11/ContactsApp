using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace MyApi.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Contact>()
                .HasOne<User>() // Assuming a relationship exists
                .WithMany()
                .HasForeignKey(c => c.UserId);
        }
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }
    }
}
