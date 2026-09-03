import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";
import type { ApplicationFormValues, ApplicationType } from "../../../types/application";
import { getPropertyById } from "../../../services/properties";
import { formatPropertyAddress } from "../../../types/property";
import FormField from "../../../components/application/FormField";
import "./steps.css";

interface ReviewStepProps {
  applicationType: ApplicationType;
  documentCount: number;
}

function ReviewStep({ applicationType, documentCount }: ReviewStepProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  const values = watch();
  const property = getPropertyById(values.propertyId);

  return (
    <div className="app-step">
      <h2>Review & sign</h2>
      <p className="app-step__description">
        Please review your application before submitting. You can go back to any step to make changes.
      </p>

      <div className="review-summary">
        <div className="review-summary__section">
          <h3>Property</h3>
          <dl className="review-summary__row">
            <dt>Address</dt>
            <dd>{property ? formatPropertyAddress(property) : "—"}</dd>
          </dl>
        </div>

        <div className="review-summary__section">
          <h3>Applicant</h3>
          <dl className="review-summary__row">
            <dt>Name</dt>
            <dd>
              {values.firstName} {values.lastName}
            </dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Contact</dt>
            <dd>
              {values.phone} · {values.email}
            </dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Current address</dt>
            <dd>
              {values.currentStreet}, {values.currentCity}, {values.currentState} {values.currentZip}
            </dd>
          </dl>
        </div>

        <div className="review-summary__section">
          <h3>Employment & income</h3>
          <dl className="review-summary__row">
            <dt>Employer</dt>
            <dd>{values.employerName}</dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Monthly income</dt>
            <dd>${values.monthlyIncome}</dd>
          </dl>
        </div>

        <div className="review-summary__section">
          <h3>Household</h3>
          <dl className="review-summary__row">
            <dt>Additional occupants</dt>
            <dd>{values.occupants?.length ?? 0}</dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Pets</dt>
            <dd>{values.pets?.length ?? 0}</dd>
          </dl>
          <dl className="review-summary__row">
            <dt>Vehicles</dt>
            <dd>{values.vehicles?.length ?? 0}</dd>
          </dl>
        </div>

        <div className="review-summary__section">
          <h3>Documents</h3>
          <dl className="review-summary__row">
            <dt>Attached</dt>
            <dd>{documentCount}</dd>
          </dl>
        </div>

        {applicationType === "rent-to-own" && (
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
      </div>

      <p className="app-step__description">
        By submitting, you agree to how we handle your information — see our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <div className="checkbox-field">
        <input id="certifyTrue" type="checkbox" {...register("certifyTrue")} />
        <label htmlFor="certifyTrue">I certify that the information provided in this application is true and accurate.</label>
      </div>
      {errors.certifyTrue && (
        <p className="form-field__error" role="alert">
          {errors.certifyTrue.message as string}
        </p>
      )}

      <div className="checkbox-field">
        <input id="authorizeBackgroundCheck" type="checkbox" {...register("authorizeBackgroundCheck")} />
        <label htmlFor="authorizeBackgroundCheck">
          I authorize JustHomes to run a background and rental history check as part of this application.
        </label>
      </div>
      {errors.authorizeBackgroundCheck && (
        <p className="form-field__error" role="alert">
          {errors.authorizeBackgroundCheck.message as string}
        </p>
      )}

      <div className="checkbox-field">
        <input id="consentEmailDelivery" type="checkbox" {...register("consentEmailDelivery")} />
        <label htmlFor="consentEmailDelivery">
          I agree to receive a copy of my submitted application and any resulting contract by email.
        </label>
      </div>
      {errors.consentEmailDelivery && (
        <p className="form-field__error" role="alert">
          {errors.consentEmailDelivery.message as string}
        </p>
      )}

      <FormField
        label="Type your full legal name to sign"
        htmlFor="signatureFullName"
        required
        error={errors.signatureFullName?.message}
      >
        <input id="signatureFullName" className="form-input" {...register("signatureFullName")} />
      </FormField>
    </div>
  );
}

export default ReviewStep;
