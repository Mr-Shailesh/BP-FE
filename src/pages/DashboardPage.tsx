import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully. See you soon!");
    navigate("/login");
  };

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  AuthDash
                </span>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className="text-sm font-bold text-primary-600"
                >
                  Home
                </Link>
                <Link
                  to="/books"
                  className="text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors"
                >
                  Books
                </Link>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors flex items-center border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200"
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-slate-600 text-lg">
            Everything looks good today. Here is your account overview.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* User Profile Card */}
          <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{fullName}</h2>
              <p className="text-slate-500 font-medium">{user?.email}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">User ID</span>
                <span className="text-slate-900 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                  {user?._id}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Joined</span>
                <span className="text-slate-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              title="Redux Toolkit"
              description="Global state managed efficiently with async thunks and slices."
              icon="⚡"
            />
            <FeatureCard
              title="Tailwind CSS"
              description="Modern utility-first styling for a premium responsive experience."
              icon="🎨"
            />
            <FeatureCard
              title="JWT Auth"
              description="Secure session management with automated token interceptors."
              icon="🔐"
            />
            <FeatureCard
              title="Protected Flows"
              description="Advanced route protection ensuring data privacy and security."
              icon="🛡️"
            />
            <div onClick={() => navigate("/books")} className="cursor-pointer">
              <FeatureCard
                title="Books CRUD"
                description="Manage your library with full Create, Read, Update, and Delete support."
                icon="📚"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        © {new Date().getFullYear()} AuthDash Premium Boilerplate. Built with
        Redux & Tailwind.
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
