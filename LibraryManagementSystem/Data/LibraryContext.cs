using LibraryManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace LibraryManagementSystem.Data
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }

        public DbSet<Book> Books => Set<Book>();
        public DbSet<Member> Members => Set<Member>();
    }
}
