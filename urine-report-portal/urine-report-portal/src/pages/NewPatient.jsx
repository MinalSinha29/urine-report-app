import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FileCheck2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import FormSection from "../components/ui/FormSection";
import InputField from "../components/ui/InputField";
import SelectField from "../components/ui/SelectField";
import Button from "../components/ui/Button";
import { PARAMETERS } from "../data/parameters";
import { evaluateReport } from "../lib/evaluateReport";
import { useReportStore } from "../lib/ReportContext";

const GENDER_OPTIONS = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Other", label: "Other" },
];

function generateReportId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `RPT-${new Date().getFullYear()}-0${n}`;
}

export default function NewPatient() {
  const navigate = useNavigate();
  const { saveReport } = useReportStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = async (formValues) => {
    // Split the flat form data back into patient info vs. parameter values
    const parameterValues = Object.fromEntries(
      PARAMETERS.map((p) => [p.key, formValues[p.key]])
    );

    const evaluation = evaluateReport(parameterValues);
    const reportId = generateReportId();

    saveReport(reportId, {
      id: reportId,
      patient: {
        patientId: formValues.patientId,
        name: formValues.name,
        age: formValues.age,
        gender: formValues.gender,
        phone: formValues.phone,
        doctor: formValues.doctor,
        date: formValues.date,
      },
      ...evaluation,
    });

    navigate(`/report/${reportId}`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Urinalysis"
        title="New Patient"
        subtitle="Enter patient details and the 10 urinalysis parameters to generate a report."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-4xl"
        noValidate
      >
        <FormSection
          title="Patient Information"
          description="Basic details used to identify and file this report."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              label="Patient ID"
              required
              {...register("patientId", { required: "Patient ID is required" })}
              error={errors.patientId?.message}
            />
            <InputField
              label="Full Name"
              required
              placeholder="e.g. Anjali Rao"
              {...register("name", { required: "Name is required" })}
              error={errors.name?.message}
            />
            <InputField
              label="Age"
              type="number"
              required
              placeholder="e.g. 34"
              {...register("age", {
                required: "Age is required",
                min: { value: 0, message: "Enter a valid age" },
                max: { value: 120, message: "Enter a valid age" },
              })}
              error={errors.age?.message}
            />
            <SelectField
              label="Gender"
              required
              options={GENDER_OPTIONS}
              {...register("gender", { required: true })}
            />
            <InputField
              label="Phone"
              type="tel"
              placeholder="e.g. 98765 43210"
              {...register("phone", {
                pattern: {
                  value: /^[0-9+\-\s]{7,15}$/,
                  message: "Enter a valid phone number",
                },
              })}
              error={errors.phone?.message}
            />
            <InputField
              label="Doctor Name"
              required
              placeholder="e.g. Dr. Ninad Mehendale"
              {...register("doctor", { required: "Doctor name is required" })}
              error={errors.doctor?.message}
            />
            <InputField
              label="Date"
              type="date"
              required
              {...register("date", { required: "Date is required" })}
              error={errors.date?.message}
            />
          </div>
        </FormSection>

        <FormSection
          title="Urinalysis Parameters"
          description="Values as read from the test strip. Each will be compared against its clinical reference range."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARAMETERS.map((param) => (
              <InputField
                key={param.key}
                label={param.label}
                unit={param.unit || undefined}
                hint={`Ref: ${param.low}\u2013${param.normalMax}`}
                type="number"
                step="any"
                required
                placeholder="0"
                {...register(param.key, {
                  required: `${param.label} is required`,
                  valueAsNumber: true,
                })}
                error={errors[param.key]?.message}
              />
            ))}
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button type="submit" icon={FileCheck2} disabled={isSubmitting}>
            {isSubmitting ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
