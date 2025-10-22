using LibraryManagementSystem.Data;
using LibraryManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly LibraryContext _db;

        public MembersController(LibraryContext db)
        {
            _db = db;
        }

        // GET: api/members
        [HttpGet]
        public async Task<IActionResult> GetMembers()
        {
            var members = await _db.Members.ToListAsync();
            return Ok(members);
        }

        // POST: api/members
        [HttpPost]
        public async Task<IActionResult> AddMember(Member model)
        {
            _db.Members.Add(model);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMembers), new { id = model.Id }, model);
        }
    }
}
