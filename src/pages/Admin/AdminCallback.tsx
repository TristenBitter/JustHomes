import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { completeAdminLogin } from "../../services/adminAuth";
import "./Admin.css";

function AdminCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [asyncError, setAsyncError] = useState<string | null>(null);
  const ranOnce = useRef(false);

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  const validationError = oauthError
    ? "Sign in was cancelled or denied."
    : !code || !state
      ? "Missing sign-in details. Please try again."
      : null;

  useEffect(() => {
    if (ranOnce.current || validationError || !code || !state) return;
    ranOnce.current = true;

    completeAdminLogin(code, state)
      .then(() => navigate("/admin/applications", { replace: true }))
      .catch((err: Error) => setAsyncError(err.message));
  }, [code, state, validationError, navigate]);

  const error = validationError ?? asyncError;

  return (
    <div className="admin-login container">
      <p className="admin-eyebrow">JustHomes Admin</p>
      {error ? (
        <>
          <h1>Sign in failed</h1>
          <p className="admin-login__note">{error}</p>
          <a href="/admin/login" className="btn btn-primary">
            Try again
          </a>
        </>
      ) : (
        <h1>Signing you in…</h1>
      )}
    </div>
  );
}

export default AdminCallback;
