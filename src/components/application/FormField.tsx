import type { ReactNode } from "react";
import "./FormField.css";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

function FormField({ label, htmlFor, error, required, hint, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor} className="form-field__label">
        {label}
        {required && <span className="form-field__required"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="form-field__hint">{hint}</p>}
      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
