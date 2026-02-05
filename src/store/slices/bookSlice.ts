import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { bookService } from "../../services/bookService";
import { Book, CreateBookDto, UpdateBookDto } from "../../types/book";

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  currentBook: Book | null;
}

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
  currentBook: null,
};

// Async thunks
export const fetchBooks = createAsyncThunk<Book[], void, { rejectValue: string }>(
  "books/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookService.getAllBooks();
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const addBook = createAsyncThunk<Book, CreateBookDto, { rejectValue: string }>(
  "books/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bookService.createBook(data);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const updateExistingBook = createAsyncThunk<Book, { id: string; data: UpdateBookDto }, { rejectValue: string }>(
  "books/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await bookService.updateBook(id, data);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const deleteBook = createAsyncThunk<string, string, { rejectValue: string }>(
  "books/delete",
  async (id, { rejectWithValue }) => {
    try {
      await bookService.deleteBook(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBook: (state, action: PayloadAction<Book | null>) => {
      state.currentBook = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch books";
      })
      // Add Book
      .addCase(addBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add book";
      })
      // Update Book
      .addCase(updateExistingBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExistingBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(updateExistingBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update book";
      })
      // Delete Book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete book";
      });
  },
});

export const { clearError, setCurrentBook } = bookSlice.actions;
export default bookSlice.reducer;
