import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, ApiError } from "../../services/api";
import { getAdminAccessToken } from "../../services/adminAuth";
import { getPropertyById } from "../../services/properties";
import { formatPropertyAddress } from "../../types/property";
import "./Admin.css";

interface ApplicationSummary {
  applicationId: string;
  applicationType: "apartment" | "rent-to-own";
  propertyId: string;
  submittedAt: string;
  applicantName: string;
  applicantEmail: string;
}

function AdminApplications() {
  const [applications, setApplications] = useState<ApplicationSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminAccessToken();
    apiGet<{ items: ApplicationSummary[] }>("/applications", token ?? undefined)
      .then((response) => setApplications(response.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load applications."));
  }, []);

  return (
    <div className="admin-applications">
      <h1>Submitted applications</h1>

      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}

      {!applications && !error && <p>Loading…</p>}

      {applications && applications.length === 0 && <p>No applications submitted yet.</p>}

      {applications && applications.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Submitted</th>
              <th>Type</th>
              <th>Property</th>
              <th>Applicant</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => {
              const property = getPropertyById(application.propertyId);
              return (
                <tr key={application.applicationId}>
                  <td>{new Date(application.submittedAt).toLocaleString()}</td>
                  <td>{application.applicationType === "apartment" ? "Apartment" : "Rent-to-own"}</td>
                  <td>{property ? formatPropertyAddress(property) : application.propertyId}</td>
                  <td>
                    <Link to={`/admin/applications/${application.applicationId}`}>
                      {application.applicantName || application.applicantEmail}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminApplications;
