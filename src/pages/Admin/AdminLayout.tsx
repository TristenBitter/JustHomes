import { Link, Outlet } from "react-router-dom";
import { adminLogout, getAdminEmail } from "../../services/adminAuth";
import "./Admin.css";

function AdminLayout() {
  const email = getAdminEmail();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="container admin-header__inner">
          <Link to="/admin/applications" className="admin-header__brand">
            🏡 JustHomes Admin
          </Link>
          <div className="admin-header__user">
            {email && <span>{email}</span>}
            <button type="button" className="btn btn-secondary" onClick={adminLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="container admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
