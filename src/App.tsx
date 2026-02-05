import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";
import ErrorPage from "./pages/ErrorPage";
import { useAppDispatch } from "./store/hooks";
import { checkAuthStatus } from "./store/slices/authSlice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        {/* Catch-all Global Error/404 Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
