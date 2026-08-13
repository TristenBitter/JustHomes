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
import { saveApplication } from "../../services/applications";
import StepIndicator from "../../components/application/StepIndicator";
import PropertyStep from "./steps/PropertyStep";
import ApplicantInfoStep from "./steps/ApplicantInfoStep";
import EmploymentStep from "./steps/EmploymentStep";
import ResidenceHistoryStep from "./steps/ResidenceHistoryStep";
import HouseholdStep from "./steps/HouseholdStep";
import ReferencesStep from "./steps/ReferencesStep";
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
      render: () => <ReviewStep applicationType={applicationType} />,
    });

    return base;
  }, [applicationType, propertyType]);

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

  const onSubmit = methods.handleSubmit((values) => {
    const result = saveApplication(applicationType, values);
    setSubmitted(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

          <div className="application-wizard__actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={stepIndex === 0}
            >
              Back
            </button>
            {isLastStep ? (
              <button type="submit" className="btn btn-primary">
                Submit Application
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
