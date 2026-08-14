import { Link } from "react-router-dom";
import type { SubmittedApplication } from "../../types/application";
import { getPropertyById } from "../../services/properties";
import { formatPropertyAddress } from "../../types/property";
import "./Confirmation.css";

interface ConfirmationProps {
  application: SubmittedApplication;
}

function Confirmation({ application }: ConfirmationProps) {
  const property = getPropertyById(application.values.propertyId);

  return (
    <div className="confirmation container">
      <span className="confirmation__icon" aria-hidden="true">
        ✅
      </span>
      <h1>Application submitted</h1>
      <p className="confirmation__body">
        Thanks, {application.values.firstName}. Your{" "}
        {application.applicationType === "apartment" ? "apartment rental" : "rent-to-own"} application for{" "}
        <strong>{property ? formatPropertyAddress(property) : "your selected property"}</strong> has been received.
      </p>
      <p className="confirmation__body confirmation__body--note">
        A confirmation email is on its way to <strong>{application.values.email}</strong>, and our team has been
        notified. We'll be in touch about next steps.
      </p>
      <div className="confirmation__actions">
        <Link to="/apply" className="btn btn-primary">
          Back to Apply
        </Link>
        <Link to="/" className="btn btn-secondary">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default Confirmation;
