import { useState } from "react";
import { beginAdminLogin } from "../../services/adminAuth";
import "./Admin.css";

function AdminLogin() {
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setStarting(true);
    setError(null);
    try {
      await beginAdminLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in isn't available right now.");
      setStarting(false);
    }
  };

  return (
    <div className="admin-login container">
      <p className="admin-eyebrow">JustHomes Admin</p>
      <h1>Staff sign in</h1>
      <p className="admin-login__note">This area is restricted to JustHomes staff.</p>
      <button type="button" className="btn btn-primary" onClick={handleSignIn} disabled={starting}>
        {starting ? "Redirecting…" : "Sign in"}
      </button>
      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default AdminLogin;
