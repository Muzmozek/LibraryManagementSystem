using System.ComponentModel.DataAnnotations;

namespace LibraryManagementSystem.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        public string ISBN { get; set; } = string.Empty;

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;

        // Indicates whether a book is currently borrowed
        public bool IsBorrowed { get; set; }

        // Member who borrowed this book (if any)
        public int? MemberId { get; set; }

        public Member? Member { get; set; }
    }
}
