import { useFormContext } from "react-hook-form";
import { employmentLengthOptions, type ApplicationFormValues } from "../../../types/application";
import FormField from "../../../components/application/FormField";
import "./steps.css";

function EmploymentStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  return (
    <div className="app-step">
      <h2>Employment & income</h2>
      <p className="app-step__description">Help us understand your current income situation.</p>

      <div className="form-row">
        <FormField label="Employer name" htmlFor="employerName" required error={errors.employerName?.message}>
          <input id="employerName" className="form-input" {...register("employerName")} />
        </FormField>
        <FormField label="Job title" htmlFor="jobTitle" required error={errors.jobTitle?.message}>
          <input id="jobTitle" className="form-input" {...register("jobTitle")} />
        </FormField>
      </div>

      <div className="form-row">
        <FormField label="Length of employment" htmlFor="employmentLength" required error={errors.employmentLength?.message}>
          <select id="employmentLength" className="form-select" {...register("employmentLength")}>
            <option value="">Select…</option>
            {employmentLengthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Employer phone" htmlFor="employerPhone" required error={errors.employerPhone?.message}>
          <input id="employerPhone" type="tel" className="form-input" {...register("employerPhone")} />
        </FormField>
      </div>

      <FormField label="Gross monthly income" htmlFor="monthlyIncome" required error={errors.monthlyIncome?.message}>
        <input id="monthlyIncome" type="number" min="0" step="1" className="form-input" {...register("monthlyIncome")} />
      </FormField>

      <div className="form-row">
        <FormField
          label="Additional income source (optional)"
          htmlFor="additionalIncomeSource"
          error={errors.additionalIncomeSource?.message}
        >
          <input id="additionalIncomeSource" className="form-input" {...register("additionalIncomeSource")} />
        </FormField>
        <FormField
          label="Additional income amount (optional)"
          htmlFor="additionalIncomeAmount"
          error={errors.additionalIncomeAmount?.message}
        >
          <input
            id="additionalIncomeAmount"
            type="number"
            min="0"
            step="1"
            className="form-input"
            {...register("additionalIncomeAmount")}
          />
        </FormField>
      </div>
    </div>
  );
}

export default EmploymentStep;
