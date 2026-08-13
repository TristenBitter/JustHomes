import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties, applicationTypeForProperty } from "../../services/properties";
import { formatPropertyAddress } from "../../types/property";
import "./PropertyPicker.css";

function PropertyPicker() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const properties = useMemo(() => getProperties(), []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return properties;
    return properties.filter((property) =>
      formatPropertyAddress(property).toLowerCase().includes(normalized)
    );
  }, [properties, query]);

  const handleSelect = (propertyId: string, propertyType: "apartment" | "house") => {
    const applicationType = applicationTypeForProperty(propertyType);
    const path = applicationType === "apartment" ? "/apply/apartment" : "/apply/rent-to-own";
    setOpen(false);
    setQuery("");
    navigate(`${path}?property=${propertyId}`);
  };

  return (
    <div className="property-picker">
      <label htmlFor="property-picker-input" className="property-picker__label">
        Have a specific address in mind?
      </label>
      <input
        id="property-picker-input"
        type="text"
        className="form-input"
        placeholder="Start typing an address…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && (
        <ul className="property-picker__results">
          {results.length === 0 && <li className="property-picker__empty">No matching address found.</li>}
          {results.map((property) => (
            <li key={property.id}>
              <button
                type="button"
                className="property-picker__result"
                onMouseDown={() => handleSelect(property.id, property.type)}
              >
                <span>{formatPropertyAddress(property)}</span>
                <span className="property-picker__tag">
                  {property.type === "apartment" ? "Apartment" : "Rent-to-own"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PropertyPicker;
