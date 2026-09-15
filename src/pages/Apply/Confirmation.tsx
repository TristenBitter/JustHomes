import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
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
        <CheckCircle2 size={40} strokeWidth={1.75} />
      </span>
      <h1>Application submitted</h1>
      <p className="confirmation__body">
        Thanks, {application.values.firstName}. Your{" "}
        {application.applicationType === "apartment" ? "apartment rental" : "rent-to-own"} application for{" "}
        <strong>{property ? formatPropertyAddress(property) : "your selected property"}</strong> has been received.
      </p>
      <p className="confirmation__body confirmation__body--note">
        Our team has been notified and will review your application. We'll be in touch about next steps at{" "}
        <strong>{application.values.phone}</strong> or <strong>{application.values.email}</strong>.
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
