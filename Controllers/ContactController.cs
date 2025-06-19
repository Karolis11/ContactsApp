using Microsoft.AspNetCore.Mvc;
using MyApi.Data;
using MyApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Security.Claims;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactsController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetAll()
        {
            var userId = GetUserId();
            var contacts = await _context.Contacts
                .Where(c => c.UserId == userId)
                .ToListAsync();
            return Ok(contacts);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Contact>> Create(Contact contact)
        {
            contact.UserId = GetUserId();
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();
            return Ok(contact);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Contact updated)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();
            contact.Name = updated.Name;
            contact.Email = updated.Email;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();
            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private int GetUserId()
        {
            Console.WriteLine("Retrieving User ID from claims.");
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
            {
                Console.WriteLine("User ID claim is missing.");
                throw new UnauthorizedAccessException("User ID claim is missing.");
            }
            Console.WriteLine($"User ID claim found: {userIdClaim}");
            return int.Parse(userIdClaim);
        }
    }
}
