import type { ChangeEvent } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length > 6) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length > 3) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return "";
}

interface PhoneInputProps {
  id: string;
  registration: UseFormRegisterReturn;
}

function PhoneInput({ id, registration }: PhoneInputProps) {
  const { onChange, ...rest } = registration;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = formatPhone(event.target.value);
    onChange(event);
  };

  return (
    <input
      id={id}
      type="tel"
      className="form-input"
      placeholder="(000) 000-0000"
      inputMode="numeric"
      maxLength={14}
      {...rest}
      onChange={handleChange}
    />
  );
}

export default PhoneInput;
