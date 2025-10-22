using LibraryManagementSystem.Data;
using Microsoft.EntityFrameworkCore;

// Developed by Muzhafar (Pre-interview assignment)

var builder = WebApplication.CreateBuilder(args);

// Register EF Core with SQL Server
builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
