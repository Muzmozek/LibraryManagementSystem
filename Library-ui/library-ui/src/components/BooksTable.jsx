import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getBooks, createBook, borrowBook, returnBook } from "../api/bookApi";

// For Excel export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function BooksTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([{ id: "id", desc: false }]); // Initial sort arrow

  // Load books
  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks();
      setData(res.data);
    } catch (e) {
      console.error("API ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Columns
  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "Title", accessorKey: "title" },
      { header: "Author", accessorKey: "author" },
      {
        header: "Status",
        accessorKey: "isBorrowed",
        cell: info => (info.getValue() ? "Borrowed" : "Available"),
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const book = row.original;
          return (
            <>
              <button
                className="btn btn-sm btn-warning me-2"
                disabled={book.isBorrowed}
                onClick={async () => {
                  const memberId = prompt("Member ID");
                  if (!memberId) return;
                  await borrowBook(book.id, memberId);
                  loadBooks();
                }}
              >
                Borrow
              </button>
              <button
                className="btn btn-sm btn-success"
                disabled={!book.isBorrowed}
                onClick={async () => {
                  await returnBook(book.id);
                  loadBooks();
                }}
              >
                Return
              </button>
            </>
          );
        },
      },
    ],
    []
  );

  // Global filter (search)
  const filteredData = useMemo(() => {
  if (!globalFilter) return data;

  return data.filter(book => {
    const values = {
      ...book,
      isBorrowed: book.isBorrowed ? "Borrowed" : "Available", // convert boolean
    };

    return Object.values(values)
      .join(" ")
      .toLowerCase()
      .includes(globalFilter.toLowerCase());
  });
}, [data, globalFilter]);

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Add book
  const addBook = async () => {
    const title = prompt("Title");
    const author = prompt("Author");
    if (!title || !author) return;
    await createBook({ title, author });
    loadBooks();
  };

  // Export CSV
  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    const headers = ["ID", "Title", "Author", "Status"];
    const rows = data.map(book => [
      book.id,
      book.title,
      book.author,
      book.isBorrowed ? "Borrowed" : "Available",
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "books.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Excel
  const exportToExcel = () => {
    if (!data || data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(
      data.map(book => ({
        ID: book.id,
        Title: book.title,
        Author: book.author,
        Status: book.isBorrowed ? "Borrowed" : "Available",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Books");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/octet-stream" });
    saveAs(blob, "books.xlsx");
  };

  return (
    <div>
      {/* Header: Add + Export + Search */}
      <div className="d-flex justify-content-between mb-2 flex-wrap">
        <div className="mb-2">
          <button className="btn btn-primary me-2" onClick={addBook}>
            ➕ Add Book
          </button>
          <button className="btn btn-outline-secondary me-2" onClick={exportToCSV}>
            Export CSV
          </button>
          <button className="btn btn-outline-success" onClick={exportToExcel}>
            Export Excel
          </button>
        </div>
        <input
          className="form-control w-25 mb-2"
          placeholder="Search..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: "pointer" }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? " 🔽"} {/* show arrow initially */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex gap-2 align-items-center mt-2 flex-wrap">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>
        {Array.from({ length: table.getPageCount() }).map((_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${
              table.getState().pagination.pageIndex === i
                ? "btn-primary"
                : "btn-secondary"
            }`}
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>

        <select
          className="form-select w-auto ms-auto"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
