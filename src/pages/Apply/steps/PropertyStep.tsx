import { useFormContext } from "react-hook-form";
import { getPropertiesByType } from "../../../services/properties";
import { formatPropertyAddress, type PropertyType } from "../../../types/property";
import type { ApplicationFormValues } from "../../../types/application";
import FormField from "../../../components/application/FormField";
import "./steps.css";

interface PropertyStepProps {
  propertyType: PropertyType;
}

function PropertyStep({ propertyType }: PropertyStepProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  const properties = getPropertiesByType(propertyType);
  const selectedId = watch("propertyId");
  const selected = properties.find((property) => property.id === selectedId);

  return (
    <div className="app-step">
      <h2>Select the property</h2>
      <p className="app-step__description">
        Choose the {propertyType === "apartment" ? "apartment unit" : "home"} you're applying for.
      </p>

      {selected && (
        <div className="property-summary-card">
          <div>
            <p className="property-summary-card__address">{formatPropertyAddress(selected)}</p>
            <p className="property-summary-card__type">
              {propertyType === "apartment" ? "Apartment" : "Rent-to-own home"}
            </p>
          </div>
        </div>
      )}

      <FormField
        label="Property"
        htmlFor="propertyId"
        required
        error={errors.propertyId?.message as string | undefined}
      >
        <select id="propertyId" className="form-select" {...register("propertyId")}>
          <option value="">Select an address…</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {formatPropertyAddress(property)}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  );
}

export default PropertyStep;
