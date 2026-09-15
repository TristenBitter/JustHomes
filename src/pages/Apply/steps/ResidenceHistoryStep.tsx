import { useFormContext } from "react-hook-form";
import {
  employmentLengthOptions,
  residenceTypeOptions,
  type ApplicationFormValues,
} from "../../../types/application";
import FormField from "../../../components/application/FormField";
import PhoneInput from "../../../components/application/PhoneInput";
import "./steps.css";

function ResidenceHistoryStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  return (
    <div className="app-step">
      <h2>Residence history</h2>
      <p className="app-step__description">Tell us about your current living situation.</p>

      <div className="form-row">
        <FormField
          label="Time at current address"
          htmlFor="currentAddressDuration"
          required
          error={errors.currentAddressDuration?.message}
        >
          <select id="currentAddressDuration" className="form-select" {...register("currentAddressDuration")}>
            <option value="">Select…</option>
            {employmentLengthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Current residence type" htmlFor="residenceType" required error={errors.residenceType?.message}>
          <select id="residenceType" className="form-select" {...register("residenceType")}>
            <option value="">Select…</option>
            {residenceTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="form-row">
        <FormField label="Landlord name (if renting)" htmlFor="landlordName" error={errors.landlordName?.message}>
          <input id="landlordName" className="form-input" {...register("landlordName")} />
        </FormField>
        <FormField label="Landlord phone (if renting)" htmlFor="landlordPhone" error={errors.landlordPhone?.message}>
          <PhoneInput id="landlordPhone" registration={register("landlordPhone")} />
        </FormField>
      </div>

      <FormField label="Reason for leaving (optional)" htmlFor="reasonForLeaving" error={errors.reasonForLeaving?.message}>
        <textarea id="reasonForLeaving" className="form-textarea" {...register("reasonForLeaving")} />
      </FormField>

      <h3>Background questions</h3>

      <FormField
        label="Have you ever been evicted from an apartment or residence?"
        htmlFor="everEvicted"
        required
        error={errors.everEvicted?.message}
      >
        <div className="radio-row">
          <label className="radio-option">
            <input type="radio" value="Yes" {...register("everEvicted")} />
            Yes
          </label>
          <label className="radio-option">
            <input type="radio" value="No" {...register("everEvicted")} />
            No
          </label>
        </div>
      </FormField>

      <FormField
        label="Have you ever been convicted of a crime?"
        htmlFor="everConvicted"
        required
        error={errors.everConvicted?.message}
      >
        <div className="radio-row">
          <label className="radio-option">
            <input type="radio" value="Yes" {...register("everConvicted")} />
            Yes
          </label>
          <label className="radio-option">
            <input type="radio" value="No" {...register("everConvicted")} />
            No
          </label>
        </div>
      </FormField>
    </div>
  );
}

export default ResidenceHistoryStep;
