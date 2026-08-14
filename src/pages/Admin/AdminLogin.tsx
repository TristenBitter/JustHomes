import { useState } from "react";
import { beginAdminLogin } from "../../services/adminAuth";
import "./Admin.css";

function AdminLogin() {
  const [starting, setStarting] = useState(false);

  const handleSignIn = () => {
    setStarting(true);
    beginAdminLogin();
  };

  return (
    <div className="admin-login container">
      <p className="admin-eyebrow">JustHomes Admin</p>
      <h1>Staff sign in</h1>
      <p className="admin-login__note">This area is restricted to JustHomes staff.</p>
      <button type="button" className="btn btn-primary" onClick={handleSignIn} disabled={starting}>
        {starting ? "Redirecting…" : "Sign in"}
      </button>
    </div>
  );
}

export default AdminLogin;
