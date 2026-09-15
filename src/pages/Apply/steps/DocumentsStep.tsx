import { useRef, useState } from "react";
import { uploadDocument, type UploadedDocument } from "../../../services/uploads";
import type { ApplicationType } from "../../../types/application";
import "./steps.css";

interface DocumentsStepProps {
  applicationType: ApplicationType;
  documents: UploadedDocument[];
  onAdd: (document: UploadedDocument) => void;
  onRemove: (key: string) => void;
  showRequiredError?: boolean;
}

function DocumentsStep({ applicationType, documents, onAdd, onRemove, showRequiredError }: DocumentsStepProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRentToOwn = applicationType === "rent-to-own";

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const document = await uploadDocument(file);
        onAdd(document);
      }
    } catch {
      setError("One or more files failed to upload. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="app-step">
      <h2>{isRentToOwn ? "Photo ID" : "Supporting documents"}</h2>
      <p className="app-step__description">
        {isRentToOwn
          ? "A state-issued photo ID (driver's license or other government-issued ID) is required for rent-to-own applications."
          : "Optional — attach a photo ID or proof of income if you have them handy. You can also send these later if it's easier."}
      </p>

      {documents.length === 0 && <p className="app-step__empty-note">No documents attached yet.</p>}
      {documents.map((doc) => (
        <div key={doc.key} className="app-step__array-item">
          <button
            type="button"
            className="app-step__array-remove"
            onClick={() => onRemove(doc.key)}
            aria-label={`Remove ${doc.filename}`}
          >
            Remove
          </button>
          <p>{doc.filename}</p>
        </div>
      ))}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        multiple
        onChange={(event) => handleFiles(event.target.files)}
        disabled={uploading}
      />
      {uploading && <p className="app-step__empty-note">Uploading…</p>}
      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
      {showRequiredError && documents.length === 0 && (
        <p className="form-field__error" role="alert">
          A photo ID upload is required to continue with a rent-to-own application.
        </p>
      )}
    </div>
  );
}

export default DocumentsStep;
