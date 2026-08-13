import { useState } from "react";
import { Link } from "react-router-dom";
import PropertyPicker from "../../components/application/PropertyPicker";
import { getMyApplications } from "../../services/applications";
import { getPropertyById } from "../../services/properties";
import { formatPropertyAddress } from "../../types/property";
import type { SubmittedApplication } from "../../types/application";
import "./ApplyHub.css";

function applicationTypeLabel(type: SubmittedApplication["applicationType"]) {
  return type === "apartment" ? "Apartment Rental Application" : "Rent-to-Own Application";
}

function ApplyHub() {
  const [myApplications] = useState<SubmittedApplication[]>(() => getMyApplications());

  return (
    <div className="apply-hub container">
      <div className="apply-hub__intro">
        <p className="apply-hub__eyebrow">Apply</p>
        <h1>Start your JustHomes application</h1>
        <p className="apply-hub__subtitle">
          Choose the path that fits what you're looking for. Every step is completed
          online — no printing, no office visit.
        </p>
      </div>

      <div className="apply-hub__paths">
        <Link to="/apply/apartment" className="apply-path-card">
          <span className="apply-path-card__icon" aria-hidden="true">
            🏢
          </span>
          <h2>Apply to Rent an Apartment</h2>
          <p>Complete a rental application for one of our apartment units.</p>
          <span className="apply-path-card__cta">Start application →</span>
        </Link>

        <Link to="/apply/rent-to-own" className="apply-path-card">
          <span className="apply-path-card__icon" aria-hidden="true">
            🏠
          </span>
          <h2>Apply to Rent-to-Own a Home</h2>
          <p>Complete an application for one of our rent-to-own houses.</p>
          <span className="apply-path-card__cta">Start application →</span>
        </Link>
      </div>

      <div className="apply-hub__picker-wrap">
        <PropertyPicker />
      </div>

      {myApplications.length > 0 && (
        <div className="apply-hub__my-applications">
          <h2>My Submitted Applications</h2>
          <p className="apply-hub__my-applications-note">
            Saved on this device only, for now — automatic email delivery isn't connected yet.
          </p>
          <ul>
            {myApplications.map((application) => {
              const property = getPropertyById(application.values.propertyId);
              return (
                <li key={application.id} className="my-application-row">
                  <div>
                    <p className="my-application-row__title">{applicationTypeLabel(application.applicationType)}</p>
                    <p className="my-application-row__address">
                      {property ? formatPropertyAddress(property) : "Property unavailable"}
                    </p>
                  </div>
                  <span className="my-application-row__date">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ApplyHub;
