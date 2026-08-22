import { useAuth } from "../context/AuthContext.jsx";

// Stand-in for AdminDashboard.jsx / EmployeeDashboard.jsx, which are
// built in later phases. This just proves the auth flow works end to end.
export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 font-body">
      <div className="max-w-md w-full bg-white rounded-xl2 shadow-card p-8 text-center">
        <p className="font-display text-2xl text-ink mb-2">
          Welcome, {user?.firstName || user?.employeeId}
        </p>
        <p className="text-slate-500 mb-6">
          You're signed in as{" "}
          <span className="font-mono text-sm text-dusk">{user?.role}</span>.
          The real {user?.role === "EMPLOYEE" ? "Employee" : "Admin"} dashboard
          is built in a later phase.
        </p>
        <button
          onClick={logout}
          className="w-full rounded-lg bg-ink text-white py-2.5 font-medium hover:bg-slate-900 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
