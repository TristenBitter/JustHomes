import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, House } from "lucide-react";
import applyImage from "../../assets/apply-page.jpg";
import PageHero from "../../components/marketing/PageHero";
import { getMyApplications } from "../../services/applications";
import type { SubmittedApplication } from "../../types/application";
import "./ApplyHub.css";

function applicationTypeLabel(type: SubmittedApplication["applicationType"]) {
  return type === "apartment" ? "Apartment Rental Application" : "Rent-to-Own Application";
}

function ApplyHub() {
  const [myApplications] = useState<SubmittedApplication[]>(() => getMyApplications());

  return (
    <>
      <PageHero
        image={applyImage}
        imageAlt="A couple reviewing paperwork together at their kitchen counter"
        eyebrow="Apply"
        title="Start your JustHomes application"
        subtitle="Choose the path that fits what you're looking for. Every step is completed online — no printing, no office visit."
        tall
      />

      <div className="apply-hub container">
        <p className="apply-hub__notice">
          <strong>Every adult aged 18 or older</strong> who intends to live in the home or apartment must
          submit their own separate application, listing the names and ages of everyone they intend to live
          with.
        </p>

        <div className="apply-hub__paths">
          <Link to="/apply/apartment" className="apply-path-card">
            <span className="apply-path-card__icon" aria-hidden="true">
              <Building2 size={28} strokeWidth={1.75} />
            </span>
            <h2>Apply to Rent an Apartment</h2>
            <p>Complete a rental application for one of our apartment units.</p>
            <span className="apply-path-card__cta">Start application →</span>
          </Link>

          <Link to="/apply/rent-to-own" className="apply-path-card">
            <span className="apply-path-card__icon" aria-hidden="true">
              <House size={28} strokeWidth={1.75} />
            </span>
            <h2>Apply to Rent-to-Own a Home</h2>
            <p>Complete an application for one of our rent-to-own houses.</p>
            <span className="apply-path-card__cta">Start application →</span>
          </Link>
        </div>

        {myApplications.length > 0 && (
          <div className="apply-hub__my-applications">
            <h2>My Submitted Applications</h2>
            <p className="apply-hub__my-applications-note">Shown here for quick reference on this device.</p>
            <ul>
              {myApplications.map((application) => (
                <li key={application.id} className="my-application-row">
                  <div>
                    <p className="my-application-row__title">{applicationTypeLabel(application.applicationType)}</p>
                    {application.values.propertyOfInterest && (
                      <p className="my-application-row__address">{application.values.propertyOfInterest}</p>
                    )}
                  </div>
                  <span className="my-application-row__date">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default ApplyHub;
