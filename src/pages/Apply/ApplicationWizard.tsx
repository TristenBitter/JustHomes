import { useMemo, useState } from "react";
import { FormProvider, useForm, type FieldErrors, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  apartmentApplicationSchema,
  rentToOwnApplicationSchema,
  type ApplicationFormValues,
  type ApplicationType,
  type SubmittedApplication,
} from "../../types/application";
import { submitApplication } from "../../services/applications";
import { ApiError } from "../../services/api";
import type { UploadedDocument } from "../../services/uploads";
import StepIndicator from "../../components/application/StepIndicator";
import PropertyStep from "./steps/PropertyStep";
import ApplicantInfoStep from "./steps/ApplicantInfoStep";
import EmploymentStep from "./steps/EmploymentStep";
import ResidenceHistoryStep from "./steps/ResidenceHistoryStep";
import HouseholdStep from "./steps/HouseholdStep";
import ReferencesStep from "./steps/ReferencesStep";
import DocumentsStep from "./steps/DocumentsStep";
import PurchaseDetailsStep from "./steps/PurchaseDetailsStep";
import ReviewStep from "./steps/ReviewStep";
import Confirmation from "./Confirmation";
import "./ApplicationWizard.css";

interface ApplicationWizardProps {
  applicationType: ApplicationType;
}

interface StepConfig {
  label: string;
  fields: string[];
  render: () => React.ReactNode;
}

const DOCUMENTS_STEP_LABEL = "Documents";

function ApplicationWizard({ applicationType }: ApplicationWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState<SubmittedApplication | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [documentsRequiredError, setDocumentsRequiredError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationBanner, setValidationBanner] = useState<string | null>(null);

  const schema = applicationType === "apartment" ? apartmentApplicationSchema : rentToOwnApplicationSchema;
  const requiresPhotoId = applicationType === "rent-to-own";

  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema) as Resolver<ApplicationFormValues>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      occupants: [],
      pets: [],
      vehicles: [],
      references: [{ name: "", relationship: "", phone: "" }],
      certifyTrue: undefined,
      authorizeBackgroundCheck: undefined,
      consentBackgroundCheckSharing: undefined,
      creditCheckConsent: undefined,
    } as Partial<ApplicationFormValues>,
  });

  const steps = useMemo<StepConfig[]>(() => {
    const base: StepConfig[] = [
      {
        label: "Property",
        fields: [],
        render: () => <PropertyStep applicationType={applicationType} />,
      },
      {
        label: "Applicant",
        fields: [
          "firstName",
          "lastName",
          "dateOfBirth",
          "phone",
          "email",
          "currentStreet",
          "currentCity",
          "currentState",
          "currentZip",
          "ssn",
        ],
        render: () => <ApplicantInfoStep applicationType={applicationType} />,
      },
      {
        label: "Employment",
        fields: ["employerName", "jobTitle", "employmentLength", "monthlyIncome", "employerPhone"],
        render: () => <EmploymentStep />,
      },
      {
        label: "Residence",
        fields: ["currentAddressDuration", "residenceType", "everEvicted", "everConvicted"],
        render: () => <ResidenceHistoryStep />,
      },
      { label: "Household", fields: ["occupants", "pets", "vehicles"], render: () => <HouseholdStep /> },
      {
        label: "References",
        fields: ["references", "emergencyContactName", "emergencyContactRelationship", "emergencyContactPhone"],
        render: () => <ReferencesStep />,
      },
      {
        label: DOCUMENTS_STEP_LABEL,
        fields: [],
        render: () => (
          <DocumentsStep
            applicationType={applicationType}
            documents={documents}
            showRequiredError={documentsRequiredError}
            onAdd={(doc) => {
              setDocuments((docs) => [...docs, doc]);
              setDocumentsRequiredError(false);
            }}
            onRemove={(key) => setDocuments((docs) => docs.filter((doc) => doc.key !== key))}
          />
        ),
      },
    ];

    if (applicationType === "rent-to-own") {
      base.push({
        label: "Purchase",
        fields: ["desiredDownPayment", "creditCheckConsent"],
        render: () => <PurchaseDetailsStep />,
      });
    }

    base.push({
      label: "Review",
      fields: ["certifyTrue", "authorizeBackgroundCheck", "consentBackgroundCheckSharing", "signatureFullName"],
      render: () => <ReviewStep applicationType={applicationType} documentCount={documents.length} />,
    });

    return base;
  }, [applicationType, documents, documentsRequiredError]);

  const isLastStep = stepIndex === steps.length - 1;
  const currentStep = steps[stepIndex];

  const handleNext = async () => {
    const valid = await methods.trigger(currentStep.fields as (keyof ApplicationFormValues)[]);
    if (!valid) return;

    if (currentStep.label === DOCUMENTS_STEP_LABEL && requiresPhotoId && documents.length === 0) {
      setDocumentsRequiredError(true);
      return;
    }

    setValidationBanner(null);
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setValidationBanner(null);
    setStepIndex((index) => Math.max(index - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpToFirstErrorStep = (errors: FieldErrors<ApplicationFormValues>) => {
    const erroredFieldNames = Object.keys(errors);
    const targetIndex = steps.findIndex((step) => step.fields.some((field) => erroredFieldNames.includes(field)));

    if (targetIndex !== -1 && targetIndex !== stepIndex) {
      setStepIndex(targetIndex);
      setValidationBanner("Please complete the required fields highlighted on this step, then continue.");
    } else {
      setValidationBanner("Please complete all required fields and checkboxes below before submitting.");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = methods.handleSubmit(async (values) => {
    if (requiresPhotoId && documents.length === 0) {
      const docStepIndex = steps.findIndex((step) => step.label === DOCUMENTS_STEP_LABEL);
      setStepIndex(docStepIndex);
      setDocumentsRequiredError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitApplication(applicationType, values, documents);
      setSubmitted(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong submitting your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }, jumpToFirstErrorStep);

  if (submitted) {
    return <Confirmation application={submitted} />;
  }

  return (
    <div className="application-wizard container">
      <p className="application-wizard__eyebrow">
        {applicationType === "apartment" ? "Apartment Rental Application" : "Rent-to-Own Application"}
      </p>
      <StepIndicator steps={steps.map((step) => step.label)} currentIndex={stepIndex} />

      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (isLastStep) {
              onSubmit(event);
            }
          }}
        >
          {validationBanner && (
            <p className="form-field__error" role="alert">
              {validationBanner}
            </p>
          )}

          {currentStep.render()}

          {submitError && (
            <p className="form-field__error" role="alert">
              {submitError}
            </p>
          )}

          <div className="application-wizard__actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={stepIndex === 0 || submitting}
            >
              Back
            </button>
            {isLastStep ? (
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default ApplicationWizard;
