import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "../../../types/application";
import FormField from "../../../components/application/FormField";
import "./steps.css";

function ApplicantInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  return (
    <div className="app-step">
      <h2>Applicant information</h2>
      <p className="app-step__description">Tell us a bit about yourself.</p>

      <div className="form-row">
        <FormField label="First name" htmlFor="firstName" required error={errors.firstName?.message}>
          <input id="firstName" className="form-input" {...register("firstName")} />
        </FormField>
        <FormField label="Last name" htmlFor="lastName" required error={errors.lastName?.message}>
          <input id="lastName" className="form-input" {...register("lastName")} />
        </FormField>
      </div>

      <div className="form-row">
        <FormField label="Date of birth" htmlFor="dateOfBirth" required error={errors.dateOfBirth?.message}>
          <input id="dateOfBirth" type="date" className="form-input" {...register("dateOfBirth")} />
        </FormField>
        <FormField label="Last 4 of SSN" htmlFor="ssnLast4" required error={errors.ssnLast4?.message}>
          <input id="ssnLast4" className="form-input" maxLength={4} inputMode="numeric" {...register("ssnLast4")} />
        </FormField>
      </div>

      <div className="form-row">
        <FormField label="Phone" htmlFor="phone" required error={errors.phone?.message}>
          <input id="phone" type="tel" className="form-input" {...register("phone")} />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
          <input id="email" type="email" className="form-input" {...register("email")} />
        </FormField>
      </div>

      <FormField label="Current street address" htmlFor="currentStreet" required error={errors.currentStreet?.message}>
        <input id="currentStreet" className="form-input" {...register("currentStreet")} />
      </FormField>

      <div className="form-row form-row--3">
        <FormField label="City" htmlFor="currentCity" required error={errors.currentCity?.message}>
          <input id="currentCity" className="form-input" {...register("currentCity")} />
        </FormField>
        <FormField label="State" htmlFor="currentState" required error={errors.currentState?.message}>
          <input id="currentState" className="form-input" maxLength={2} {...register("currentState")} />
        </FormField>
        <FormField label="ZIP" htmlFor="currentZip" required error={errors.currentZip?.message}>
          <input id="currentZip" className="form-input" {...register("currentZip")} />
        </FormField>
      </div>

      <div className="form-row">
        <FormField label="Driver's license number" htmlFor="driversLicenseNumber" error={errors.driversLicenseNumber?.message}>
          <input id="driversLicenseNumber" className="form-input" {...register("driversLicenseNumber")} />
        </FormField>
        <FormField label="Driver's license state" htmlFor="driversLicenseState" error={errors.driversLicenseState?.message}>
          <input id="driversLicenseState" className="form-input" maxLength={2} {...register("driversLicenseState")} />
        </FormField>
      </div>
    </div>
  );
}

export default ApplicantInfoStep;
