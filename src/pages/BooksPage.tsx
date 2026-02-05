import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBooks,
  addBook,
  updateExistingBook,
  deleteBook,
  clearError,
} from "../store/slices/bookSlice";
import { Book, CreateBookDto } from "../types/book";

const BooksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state: any) => state.books);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<CreateBookDto>({
    title: "",
    author: "",
    description: "",
    publishDate: "",
    publisherName: "",
  });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await dispatch(
          updateExistingBook({ id: editingBook._id, data: formData }),
        ).unwrap();
        toast.success("Book updated successfully!");
      } else {
        await dispatch(addBook(formData)).unwrap();
        toast.success("Book added to collection!");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err || "Failed to save book.");
      console.error("Submission failed:", err);
    }
  };

  const openModal = (book: Book | null = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        publishDate: book.publishDate.split("T")[0],
        publisherName: book.publisherName,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        author: "",
        description: "",
        publishDate: "",
        publisherName: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    dispatch(clearError());
  };

  const handleDelete = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (bookToDelete) {
      try {
        await dispatch(deleteBook(bookToDelete._id)).unwrap();
        toast.success("Book deleted successfully.");
        setIsDeleteModalOpen(false);
        setBookToDelete(null);
      } catch (err: any) {
        toast.error(err || "Failed to delete book.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Books Management
            </h1>
            <p className="text-slate-600">
              Manage your library collection with ease.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary-200 transition-all hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Book
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex justify-between items-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {loading && books?.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-pulse"
              >
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-full mb-6"></div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books &&
              books.map((book: Book) => (
                <div
                  key={book._id}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-slate-500 font-medium mb-4 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {book.author}
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {book.description}
                    </p>
                    <div className="space-y-2 mb-6 text-xs text-slate-400 font-medium">
                      <div className="flex justify-between uppercase tracking-wider">
                        <span>Publisher</span>
                        <span className="text-slate-700">
                          {book.publisherName}
                        </span>
                      </div>
                      <div className="flex justify-between uppercase tracking-wider">
                        <span>Published</span>
                        <span className="text-slate-700">
                          {new Date(book.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => openModal(book)}
                      className="flex-1 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      className="flex-1 px-4 py-2 bg-white text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors border border-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!loading && (!books || books.length === 0) && (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-300 shadow-inner animate-fade-in">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <span className="text-5xl">📚</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xs font-bold ring-4 ring-white">
                0
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              Virtual Library Empty
            </h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
              Your book collection is currently empty. Start building your
              digital library today!
            </p>
            <button
              onClick={() => openModal()}
              className="btn-primary px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-primary-200 flex items-center mx-auto"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Your First Book
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingBook ? "Edit Book" : "Add New Book"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center shadow-sm animate-shake">
                    <svg
                      className="w-5 h-5 text-red-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Title
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter book title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Author
                    </label>
                    <input
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Publisher
                    </label>
                    <input
                      name="publisherName"
                      value={formData.publisherName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter publisher name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Briefly describe the book..."
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] btn-primary px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary-100 transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingBook
                        ? "Update Book"
                        : "Create Book"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-scale-in p-8 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Delete Book
            </h3>
            <p className="text-slate-500 mb-8">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-700">
                "{bookToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-100 transition-all hover:bg-red-700 hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
