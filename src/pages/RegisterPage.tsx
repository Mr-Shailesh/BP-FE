import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser } from "../store/slices/authSlice";
import { AuthForm } from "../components/AuthForm";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleRegister = async (formData: Record<string, string>) => {
    try {
      await dispatch(
        registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
        }),
      ).unwrap();
      navigate("/dashboard");
    } catch (err) {
      // Error handled by redux state
    }
  };

  const registerFields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "John",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Doe",
      required: true,
    },
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
      placeholder: "Minimum 6 characters",
      required: true,
    },
    {
      name: "passwordConfirm",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
      required: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md animate-fade-in py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-slate-600">Join us to start your journey</p>
        </div>

        <AuthForm
          title="Sign Up"
          fields={registerFields}
          buttonLabel="Sign Up"
          onSubmit={handleRegister}
          loading={loading}
          error={error}
        />

        <div className="mt-8 text-center text-slate-600">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
