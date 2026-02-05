import React, { useState } from "react";

interface AuthFormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

interface AuthFormProps {
  title: string;
  fields: AuthFormField[];
  buttonLabel: string;
  onSubmit: (data: Record<string, string>) => Promise<any>;
  loading?: boolean;
  error?: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  fields,
  buttonLabel,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message);
    }
  };

  const displayError = formError || error;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 animate-slide-up">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          {title}
        </h2>

        {displayError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-sm text-red-700">{displayError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-sm font-semibold text-slate-700 ml-1"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required !== false}
                disabled={loading}
                className="input-field"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg mt-4 group relative overflow-hidden"
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                buttonLabel
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
