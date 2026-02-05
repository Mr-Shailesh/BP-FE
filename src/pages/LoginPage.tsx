import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";
import { AuthForm } from "../components/AuthForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (formData: Record<string, string>) => {
    try {
      await dispatch(
        loginUser({ email: formData.email, password: formData.password }),
      ).unwrap();
      navigate("/dashboard");
    } catch (err) {
      // Error handled by redux state
    }
  };

  const loginFields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "your@email.com",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <AuthForm
          title="Sign In"
          fields={loginFields}
          buttonLabel="Sign In"
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />

        <div className="mt-8 text-center text-slate-600">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
