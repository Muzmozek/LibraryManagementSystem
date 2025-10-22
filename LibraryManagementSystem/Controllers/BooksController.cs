using LibraryManagementSystem.Data;
using LibraryManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly LibraryContext _db;

        public BooksController(LibraryContext db)
        {
            _db = db;
        }

        // GET: api/books
        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _db.Books
                .Include(b => b.Member)
                .ToListAsync();

            return Ok(books);
        }

        // GET: api/books/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await _db.Books.FindAsync(id);
            if (book == null) return NotFound("Book not found");
            return Ok(book);
        }

        // POST: api/books
        [HttpPost]
        public async Task<IActionResult> CreateBook(Book model)
        {
            _db.Books.Add(model);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBook), new { id = model.Id }, model);
        }

        // PUT: api/books/borrow/{bookId}/member/{memberId}
        [HttpPut("borrow/{bookId}/member/{memberId}")]
        public async Task<IActionResult> BorrowBook(int bookId, int memberId)
        {
            var book = await _db.Books.FindAsync(bookId);
            var member = await _db.Members.FindAsync(memberId);

            if (book == null || member == null)
                return NotFound("Book or member not found");

            if (book.IsBorrowed)
                return BadRequest("Book already borrowed by another member");

            book.IsBorrowed = true;
            book.MemberId = memberId;
            await _db.SaveChangesAsync();

            return Ok(book);
        }

        // PUT: api/books/return/{bookId}
        [HttpPut("return/{bookId}")]
        public async Task<IActionResult> ReturnBook(int bookId)
        {
            var book = await _db.Books.FindAsync(bookId);
            if (book == null)
                return NotFound("Book not found");

            book.IsBorrowed = false;
            book.MemberId = null;
            await _db.SaveChangesAsync();

            return Ok(book);
        }
    }
}
