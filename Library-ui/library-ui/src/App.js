import React from "react";
import BooksTable from "./components/BooksTable";

// Bootstrap CSS (global)
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">📚 Library Management System</h2>
      <BooksTable />
    </div>
  );
}

export default App;
