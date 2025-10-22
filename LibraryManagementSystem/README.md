# 📚 Library Management System (Web API)

A simple Library Management System built using **ASP.NET Core 8.0 Web API** and **SQL Server 2017**.

---

## 🚀 Features
- Manage books (add, view, delete)
- Manage members
- Borrow and return books
- Built with Entity Framework Core (Code-First)
- RESTful endpoints tested with Postman and Swagger

---

## 🏗️ Tech Stack
- ASP.NET Core 8.0
- Entity Framework Core 8.0
- SQL Server 2017
- Swagger / OpenAPI
- Postman (for API testing)

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites
- Visual Studio 2022
- .NET 8 SDK
- SQL Server 2017 or higher

### 2️⃣ Database Configuration
In `appsettings.json`, update the connection string if needed:
```json
"ConnectionStrings": {
  "LibraryConnection": "Server=DESKTOP-096C06F;Database=LibraryDB;User Id=sa;Password=your_password;TrustServerCertificate=True;"
}
