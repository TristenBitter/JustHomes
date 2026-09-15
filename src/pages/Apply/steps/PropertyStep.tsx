import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues, ApplicationType } from "../../../types/application";
import FormField from "../../../components/application/FormField";
import "./steps.css";

interface PropertyStepProps {
  applicationType: ApplicationType;
}

function PropertyStep({ applicationType }: PropertyStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  return (
    <div className="app-step">
      <h2>{applicationType === "apartment" ? "Apartment rental application" : "Rent-to-own application"}</h2>
      <p className="app-step__description">
        We don't currently have any {applicationType === "apartment" ? "apartments" : "homes"} listed as
        available — all of our properties are occupied. Submitting an application now puts you on file for
        when a place opens up.
      </p>

      <FormField
        label="Is there a specific property you're interested in? (optional)"
        htmlFor="propertyOfInterest"
        hint="If you already know of a JustHomes property you'd like to be considered for, let us know here."
        error={errors.propertyOfInterest?.message}
      >
        <input
          id="propertyOfInterest"
          className="form-input"
          placeholder="e.g. an address you were told about, or leave blank"
          {...register("propertyOfInterest")}
        />
      </FormField>
    </div>
  );
}

export default PropertyStep;
