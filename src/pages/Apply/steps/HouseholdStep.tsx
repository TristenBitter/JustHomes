import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import type { ApplicationFormValues } from "../../../types/application";
import FormField from "../../../components/application/FormField";
import "./steps.css";

interface OccupantAgeNoticeProps {
  index: number;
}

function OccupantAgeNotice({ index }: OccupantAgeNoticeProps) {
  const { control } = useFormContext<ApplicationFormValues>();
  const age = useWatch({ control, name: `occupants.${index}.age` });

  if (!age || Number(age) < 18) return null;

  return (
    <p className="app-step__inline-notice">
      Since this person is 18 or older, they must submit their own separate application.
    </p>
  );
}

function HouseholdStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  const occupants = useFieldArray({ control, name: "occupants" });
  const pets = useFieldArray({ control, name: "pets" });
  const vehicles = useFieldArray({ control, name: "vehicles" });

  return (
    <div className="app-step">
      <h2>Intended occupants, pets & vehicles</h2>
      <p className="app-step__description">
        List everyone else who will live at the property, plus any pets or vehicles.
      </p>
      <p className="app-step__notice">
        Every occupant aged 18 or older must submit their own separate application. List them below with
        their age.
      </p>

      <h3>Intended occupants</h3>
      {occupants.fields.length === 0 && <p className="app-step__empty-note">No additional occupants added.</p>}
      {occupants.fields.map((field, index) => (
        <div key={field.id} className="app-step__array-item">
          <button
            type="button"
            className="app-step__array-remove"
            onClick={() => occupants.remove(index)}
            aria-label="Remove occupant"
          >
            Remove
          </button>
          <div className="form-row form-row--3">
            <FormField
              label="Name"
              htmlFor={`occupants.${index}.name`}
              required
              error={errors.occupants?.[index]?.name?.message}
            >
              <input id={`occupants.${index}.name`} className="form-input" {...register(`occupants.${index}.name`)} />
            </FormField>
            <FormField
              label="Relationship"
              htmlFor={`occupants.${index}.relationship`}
              required
              error={errors.occupants?.[index]?.relationship?.message}
            >
              <input
                id={`occupants.${index}.relationship`}
                className="form-input"
                {...register(`occupants.${index}.relationship`)}
              />
            </FormField>
            <FormField
              label="Age"
              htmlFor={`occupants.${index}.age`}
              required
              error={errors.occupants?.[index]?.age?.message}
            >
              <input
                id={`occupants.${index}.age`}
                type="number"
                min="0"
                className="form-input"
                {...register(`occupants.${index}.age`)}
              />
            </FormField>
          </div>
          <OccupantAgeNotice index={index} />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary app-step__array-add"
        onClick={() => occupants.append({ name: "", relationship: "", age: 0 })}
      >
        + Add occupant
      </button>

      <h3>Pets</h3>
      {pets.fields.length === 0 && <p className="app-step__empty-note">No pets added.</p>}
      {pets.fields.map((field, index) => (
        <div key={field.id} className="app-step__array-item">
          <button
            type="button"
            className="app-step__array-remove"
            onClick={() => pets.remove(index)}
            aria-label="Remove pet"
          >
            Remove
          </button>
          <div className="form-row form-row--3">
            <FormField label="Type" htmlFor={`pets.${index}.type`} required error={errors.pets?.[index]?.type?.message}>
              <input id={`pets.${index}.type`} className="form-input" {...register(`pets.${index}.type`)} />
            </FormField>
            <FormField
              label="Breed"
              htmlFor={`pets.${index}.breed`}
              required
              error={errors.pets?.[index]?.breed?.message}
            >
              <input id={`pets.${index}.breed`} className="form-input" {...register(`pets.${index}.breed`)} />
            </FormField>
            <FormField
              label="Weight (lbs)"
              htmlFor={`pets.${index}.weight`}
              error={errors.pets?.[index]?.weight?.message}
            >
              <input
                id={`pets.${index}.weight`}
                className="form-input"
                inputMode="numeric"
                placeholder="e.g. 45"
                {...register(`pets.${index}.weight`)}
              />
            </FormField>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary app-step__array-add"
        onClick={() => pets.append({ type: "", breed: "", weight: "" })}
      >
        + Add pet
      </button>

      <h3>Vehicles</h3>
      {vehicles.fields.length === 0 && <p className="app-step__empty-note">No vehicles added.</p>}
      {vehicles.fields.map((field, index) => (
        <div key={field.id} className="app-step__array-item">
          <button
            type="button"
            className="app-step__array-remove"
            onClick={() => vehicles.remove(index)}
            aria-label="Remove vehicle"
          >
            Remove
          </button>
          <div className="form-row form-row--3">
            <FormField
              label="Make"
              htmlFor={`vehicles.${index}.make`}
              required
              error={errors.vehicles?.[index]?.make?.message}
            >
              <input id={`vehicles.${index}.make`} className="form-input" {...register(`vehicles.${index}.make`)} />
            </FormField>
            <FormField
              label="Model"
              htmlFor={`vehicles.${index}.model`}
              required
              error={errors.vehicles?.[index]?.model?.message}
            >
              <input id={`vehicles.${index}.model`} className="form-input" {...register(`vehicles.${index}.model`)} />
            </FormField>
            <FormField label="License plate" htmlFor={`vehicles.${index}.licensePlate`} error={errors.vehicles?.[index]?.licensePlate?.message}>
              <input
                id={`vehicles.${index}.licensePlate`}
                className="form-input"
                {...register(`vehicles.${index}.licensePlate`)}
              />
            </FormField>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary app-step__array-add"
        onClick={() => vehicles.append({ make: "", model: "", year: "", licensePlate: "" })}
      >
        + Add vehicle
      </button>
    </div>
  );
}

export default HouseholdStep;
