import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, ApiError } from "../../services/api";
import { getAdminAccessToken } from "../../services/adminAuth";
import { getPropertyById } from "../../services/properties";
import { formatPropertyAddress } from "../../types/property";
import type { ApplicationFormValues, ApplicationType } from "../../types/application";
import "../Apply/steps/steps.css";
import "./Admin.css";

interface ApplicationDetail {
  applicationId: string;
  applicationType: ApplicationType;
  propertyId: string;
  submittedAt: string;
  values: ApplicationFormValues;
  documentLinks: { filename: string; url: string }[];
}

function AdminApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const token = getAdminAccessToken();
    apiGet<ApplicationDetail>(`/applications/${id}`, token ?? undefined)
      .then(setApplication)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load application."));
  }, [id]);

  if (error) {
    return (
      <p className="form-field__error" role="alert">
        {error}
      </p>
    );
  }

  if (!application) {
    return <p>Loading…</p>;
  }

  const { values } = application;
  const property = getPropertyById(application.propertyId);

  return (
    <div>
      <Link to="/admin/applications">&larr; Back to applications</Link>
      <h1>
        {values.firstName} {values.lastName}
      </h1>
      <p className="app-step__description">
        {application.applicationType === "apartment" ? "Apartment Rental Application" : "Rent-to-Own Application"} ·
        Submitted {new Date(application.submittedAt).toLocaleString()}
      </p>

      <div className="review-summary">
        <div className="review-summary__section">
          <h3>Property</h3>
          <dl className="review-summary__row">
            <dt>Address</dt>
            <dd>{property ? formatPropertyAddress(property) : application.propertyId}</dd>
          </dl>
        </div>

        <div className="review-summary__section">
          <h3>Applicant</h3>
          <dl className="review-summary__row">
            <dt>Contact</dt>
            <dd>
              {values.phone} · {values.email}
            </dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Date of birth</dt>
            <dd>{values.dateOfBirth}</dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Current address</dt>
            <dd>
              {values.currentStreet}, {values.currentCity}, {values.currentState} {values.currentZip}
            </dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Last 4 of SSN</dt>
            <dd>{values.ssnLast4}</dd>
          </dl>
        </div>

        <div className="review-summary__section">
          <h3>Employment & income</h3>
          <dl className="review-summary__row">
            <dt>Employer</dt>
            <dd>
              {values.employerName} ({values.jobTitle})
            </dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Monthly income</dt>
            <dd>${values.monthlyIncome}</dd>
          </dl>
        </div>

        <div className="review-summary__section">
          <h3>Residence history</h3>
          <dl className="review-summary__row">
            <dt>Time at current address</dt>
            <dd>{values.currentAddressDuration}</dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Residence type</dt>
            <dd>{values.residenceType}</dd>
          </dl>
          {values.landlordName && (
            <dl className="review-summary__row">
              <dt>Landlord</dt>
              <dd>
                {values.landlordName} {values.landlordPhone && `· ${values.landlordPhone}`}
              </dd>
            </dl>
          )}
        </div>

        <div className="review-summary__section">
          <h3>Household</h3>
          <dl className="review-summary__row">
            <dt>Occupants</dt>
            <dd>{values.occupants?.map((o) => `${o.name} (${o.relationship}, ${o.age})`).join(", ") || "None"}</dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Pets</dt>
            <dd>{values.pets?.map((p) => p.type).join(", ") || "None"}</dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Vehicles</dt>
            <dd>{values.vehicles?.map((v) => `${v.make} ${v.model}`).join(", ") || "None"}</dd>
          </dl>
        </div>

        <div className="review-summary__section">
          <h3>References</h3>
          {values.references?.map((reference, index) => (
            <dl className="review-summary__row" key={index}>
              <dt>{reference.name}</dt>
              <dd>
                {reference.relationship} · {reference.phone}
              </dd>
            </dl>
          ))}
          <dl className="review-summary__row">
            <dt>Emergency contact</dt>
            <dd>
              {values.emergencyContactName} ({values.emergencyContactRelationship}) ·{" "}
              {values.emergencyContactPhone}
            </dd>
          </dl>
        </div>

        {application.applicationType === "rent-to-own" && (
          <div className="review-summary__section">
            <h3>Purchase details</h3>
            <dl className="review-summary__row">
              <dt>Estimated down payment</dt>
              <dd>${values.desiredDownPayment}</dd>
            </dl>
            <dl className="review-summary__row">
              <dt>Timeline</dt>
              <dd>{values.purchaseTimeline}</dd>
            </dl>
          </div>
        )}

        <div className="review-summary__section">
          <h3>Documents</h3>
          {application.documentLinks.length === 0 && <p>No documents attached.</p>}
          {application.documentLinks.map((doc) => (
            <dl className="review-summary__row" key={doc.filename}>
              <dt>{doc.filename}</dt>
              <dd>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  View / download
                </a>
              </dd>
            </dl>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminApplicationDetail;
