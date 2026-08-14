import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
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

function ApplicationWizard({ applicationType }: ApplicationWizardProps) {
  const [searchParams] = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState<SubmittedApplication | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const propertyType = applicationType === "apartment" ? "apartment" : "house";
  const schema = applicationType === "apartment" ? apartmentApplicationSchema : rentToOwnApplicationSchema;

  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema) as Resolver<ApplicationFormValues>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      propertyId: searchParams.get("property") ?? "",
      occupants: [],
      pets: [],
      vehicles: [],
      references: [{ name: "", relationship: "", phone: "" }],
      certifyTrue: undefined,
      authorizeBackgroundCheck: undefined,
      consentEmailDelivery: undefined,
      creditCheckConsent: undefined,
    } as Partial<ApplicationFormValues>,
  });

  const steps = useMemo<StepConfig[]>(() => {
    const base: StepConfig[] = [
      { label: "Property", fields: ["propertyId"], render: () => <PropertyStep propertyType={propertyType} /> },
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
          "ssnLast4",
        ],
        render: () => <ApplicantInfoStep />,
      },
      {
        label: "Employment",
        fields: ["employerName", "jobTitle", "employmentLength", "monthlyIncome", "employerPhone"],
        render: () => <EmploymentStep />,
      },
      {
        label: "Residence",
        fields: ["currentAddressDuration", "residenceType"],
        render: () => <ResidenceHistoryStep />,
      },
      { label: "Household", fields: ["occupants", "pets", "vehicles"], render: () => <HouseholdStep /> },
      {
        label: "References",
        fields: ["references", "emergencyContactName", "emergencyContactRelationship", "emergencyContactPhone"],
        render: () => <ReferencesStep />,
      },
      {
        label: "Documents",
        fields: [],
        render: () => (
          <DocumentsStep
            documents={documents}
            onAdd={(doc) => setDocuments((docs) => [...docs, doc])}
            onRemove={(key) => setDocuments((docs) => docs.filter((doc) => doc.key !== key))}
          />
        ),
      },
    ];

    if (applicationType === "rent-to-own") {
      base.push({
        label: "Purchase",
        fields: ["desiredDownPayment", "purchaseTimeline", "creditCheckConsent"],
        render: () => <PurchaseDetailsStep />,
      });
    }

    base.push({
      label: "Review",
      fields: ["certifyTrue", "authorizeBackgroundCheck", "consentEmailDelivery", "signatureFullName"],
      render: () => <ReviewStep applicationType={applicationType} documentCount={documents.length} />,
    });

    return base;
  }, [applicationType, propertyType, documents]);

  const isLastStep = stepIndex === steps.length - 1;
  const currentStep = steps[stepIndex];

  const handleNext = async () => {
    const valid = await methods.trigger(currentStep.fields as (keyof ApplicationFormValues)[]);
    if (valid) {
      setStepIndex((index) => Math.min(index + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStepIndex((index) => Math.max(index - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = methods.handleSubmit(async (values) => {
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
  });

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
