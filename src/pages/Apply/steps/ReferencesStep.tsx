import { useFieldArray, useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "../../../types/application";
import FormField from "../../../components/application/FormField";
import "./steps.css";

function ReferencesStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  const references = useFieldArray({ control, name: "references" });

  return (
    <div className="app-step">
      <h2>References & emergency contact</h2>
      <p className="app-step__description">Add at least one personal or professional reference.</p>

      {typeof errors.references?.message === "string" && (
        <p className="form-field__error" role="alert">
          {errors.references.message}
        </p>
      )}

      {references.fields.map((field, index) => (
        <div key={field.id} className="app-step__array-item">
          {references.fields.length > 1 && (
            <button
              type="button"
              className="app-step__array-remove"
              onClick={() => references.remove(index)}
              aria-label="Remove reference"
            >
              Remove
            </button>
          )}
          <div className="form-row form-row--3">
            <FormField
              label="Name"
              htmlFor={`references.${index}.name`}
              required
              error={errors.references?.[index]?.name?.message}
            >
              <input id={`references.${index}.name`} className="form-input" {...register(`references.${index}.name`)} />
            </FormField>
            <FormField
              label="Relationship"
              htmlFor={`references.${index}.relationship`}
              required
              error={errors.references?.[index]?.relationship?.message}
            >
              <input
                id={`references.${index}.relationship`}
                className="form-input"
                {...register(`references.${index}.relationship`)}
              />
            </FormField>
            <FormField
              label="Phone"
              htmlFor={`references.${index}.phone`}
              required
              error={errors.references?.[index]?.phone?.message}
            >
              <input
                id={`references.${index}.phone`}
                type="tel"
                className="form-input"
                {...register(`references.${index}.phone`)}
              />
            </FormField>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary app-step__array-add"
        onClick={() => references.append({ name: "", relationship: "", phone: "" })}
      >
        + Add reference
      </button>

      <h3>Emergency contact</h3>
      <div className="form-row form-row--3">
        <FormField
          label="Name"
          htmlFor="emergencyContactName"
          required
          error={errors.emergencyContactName?.message}
        >
          <input id="emergencyContactName" className="form-input" {...register("emergencyContactName")} />
        </FormField>
        <FormField
          label="Relationship"
          htmlFor="emergencyContactRelationship"
          required
          error={errors.emergencyContactRelationship?.message}
        >
          <input
            id="emergencyContactRelationship"
            className="form-input"
            {...register("emergencyContactRelationship")}
          />
        </FormField>
        <FormField
          label="Phone"
          htmlFor="emergencyContactPhone"
          required
          error={errors.emergencyContactPhone?.message}
        >
          <input
            id="emergencyContactPhone"
            type="tel"
            className="form-input"
            {...register("emergencyContactPhone")}
          />
        </FormField>
      </div>
    </div>
  );
}

export default ReferencesStep;
