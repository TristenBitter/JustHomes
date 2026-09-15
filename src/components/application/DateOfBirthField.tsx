import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "../../types/application";
import FormField from "./FormField";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

function DateOfBirthField() {
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<ApplicationFormValues>();

  const initial = getValues("dateOfBirth") ?? "";
  const [initialYear = "", initialMonth = "", initialDay = ""] = initial.split("-");

  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(initialDay);
  const [year, setYear] = useState(initialYear);

  const update = (next: { year?: string; month?: string; day?: string }) => {
    const y = next.year ?? year;
    const m = next.month ?? month;
    const d = next.day ?? day;
    if (next.year !== undefined) setYear(next.year);
    if (next.month !== undefined) setMonth(next.month);
    if (next.day !== undefined) setDay(next.day);

    setValue("dateOfBirth", y && m && d ? `${y}-${m}-${d}` : "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <FormField
      label="Date of birth (month / day / year)"
      htmlFor="dateOfBirth-month"
      required
      error={errors.dateOfBirth?.message}
    >
      <div className="form-row form-row--3">
        <select
          id="dateOfBirth-month"
          className="form-select"
          value={month}
          onChange={(event) => update({ month: event.target.value })}
        >
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Day"
          className="form-select"
          value={day}
          onChange={(event) => update({ day: event.target.value })}
        >
          <option value="">Day</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          aria-label="Year"
          className="form-input"
          placeholder="YYYY"
          inputMode="numeric"
          maxLength={4}
          value={year}
          onChange={(event) => update({ year: event.target.value.replace(/\D/g, "").slice(0, 4) })}
        />
      </div>
    </FormField>
  );
}

export default DateOfBirthField;
