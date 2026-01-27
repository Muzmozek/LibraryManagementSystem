import api from "./axios";

export const getBooks = () => api.get("/Books");

export const getBookById = (id) =>
  api.get(`/Books/${id}`);

export const createBook = (book) =>
  api.post("/Books", book);

export const borrowBook = (bookId, memberId) =>
  api.put(`/Books/borrow/${bookId}/member/${memberId}`);

export const returnBook = (bookId) =>
  api.put(`/Books/return/${bookId}`);
