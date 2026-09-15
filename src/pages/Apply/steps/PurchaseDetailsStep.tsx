import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "../../../types/application";
import FormField from "../../../components/application/FormField";
import "./steps.css";

function PurchaseDetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  return (
    <div className="app-step">
      <h2>Purchase details</h2>
      <p className="app-step__description">A few details specific to rent-to-own.</p>

      <div className="form-row">
        <FormField
          label="Estimated down payment"
          htmlFor="desiredDownPayment"
          required
          error={errors.desiredDownPayment?.message}
        >
          <input
            id="desiredDownPayment"
            type="number"
            min="0"
            step="1"
            className="form-input"
            {...register("desiredDownPayment")}
          />
        </FormField>
        <FormField
          label="Estimated credit range (optional)"
          htmlFor="estimatedCreditRange"
          error={errors.estimatedCreditRange?.message}
        >
          <input id="estimatedCreditRange" className="form-input" placeholder="e.g. 650–700" {...register("estimatedCreditRange")} />
        </FormField>
      </div>

      <div className="checkbox-field">
        <input id="creditCheckConsent" type="checkbox" {...register("creditCheckConsent")} />
        <label htmlFor="creditCheckConsent">
          I consent to a credit check as part of my rent-to-own application.
        </label>
      </div>
      {errors.creditCheckConsent && (
        <p className="form-field__error" role="alert">
          {errors.creditCheckConsent.message as string}
        </p>
      )}
    </div>
  );
}

export default PurchaseDetailsStep;
