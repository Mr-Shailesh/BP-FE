import React from "react";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center animate-fade-in">
        <div className="mb-8 relative">
          <h1 className="text-[12rem] font-black text-slate-200 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Page Not Found
            </h2>
          </div>
        </div>

        <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="btn-primary px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 text-slate-600 font-semibold hover:text-primary-600 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

export default ErrorPage;
