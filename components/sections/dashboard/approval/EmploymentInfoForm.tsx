
import Form from "@/components/form/Form";
import { getEmploymentInfoFields } from "@/data/pages/dashboard/approval";
import { EmploymentInfoType } from "@/type/pages/dashboard/approval";
import { useState, useMemo } from "react";

export default function EmploymentInfoForm({
  initialValues, 
  handleSubmit, 
  handleCancel
}: {
  initialValues: EmploymentInfoType;
  handleSubmit: (values: EmploymentInfoType) => Promise<void> | void;
  handleCancel: () => void;
}) {
  const [employmentStatus, setEmploymentStatus] = useState(initialValues.employment_status || '');
  
  const fields = useMemo(() => 
    getEmploymentInfoFields(employmentStatus),
    [employmentStatus]
  );

  const [currentValues, setCurrentValues] = useState(initialValues);

  const validate = (values: EmploymentInfoType) => {
    const errors: Partial<Record<keyof EmploymentInfoType, string>> = {};


    if (!values.employment_status) {
      errors.employment_status = 'Employment status is required';
    }

    if (values.employment_status === 'business_owner') {
      if (!values.business_type || values.business_type.trim() === '') {
        errors.business_type = 'Business type is required';
      }
      if (!values.incorporation_years || values.incorporation_years.trim() === '') {
        errors.incorporation_years = 'Years of incorporation is required';
      }
    } 

    else if (values.employment_status === 'employed' || values.employment_status === 'self_employed') {
      if (!values.employer_name || values.employer_name.trim() === '') {
        errors.employer_name = values.employment_status === 'self_employed' 
          ? 'Business/Client name is required' 
          : 'Employer name is required';
      }
      if (!values.job_title || values.job_title.trim() === '') {
        errors.job_title = 'Job title is required';
      }
      if (!values.current_job_years) {
        errors.current_job_years = 'Years at current position is required';
      }
      if (!values.employment_type) {
        errors.employment_type = 'Employment type is required';
      }
    }

    if (values.employment_status) {
      if (!values.gross_income || values.gross_income.trim() === '') {
        errors.gross_income = 'Gross income is required';
      }
      if (!values.income_frequency) {
        errors.income_frequency = 'Income frequency is required';
      }
    }

    return errors;
  };

  const handleFormSubmit = async (values: EmploymentInfoType) => {

    let cleanedValues: EmploymentInfoType = {
      employment_status: values.employment_status,
      employer_name: '',
      job_title: '',
      current_job_years: '',
      employment_type: '',
      gross_income: values.gross_income || '',
      other_income: values.other_income || '',
      income_frequency: values.income_frequency || '',
      business_type: '',
      incorporation_years: ''
    };

    if (values.employment_status === 'business_owner') {
      // Keep only business owner relevant fields
      cleanedValues = {
        ...cleanedValues,
        business_type: values.business_type || '',
        incorporation_years: values.incorporation_years || '',
      };
    } else if (values.employment_status === 'employed' || values.employment_status === 'self_employed') {
      // Keep only employee relevant fields
      cleanedValues = {
        ...cleanedValues,
        employer_name: values.employer_name || '',
        job_title: values.job_title || '',
        current_job_years: values.current_job_years || '',
        employment_type: values.employment_type || '',
      };
    }

    await handleSubmit(cleanedValues);
  };

  const handleFieldChange = (name: keyof EmploymentInfoType, value: any) => {
    if (name === 'employment_status') {
      setEmploymentStatus(value);
      
      // Update current values to preserve user input
      setCurrentValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Update initial values when employment status changes
  const dynamicInitialValues = useMemo(() => {
    // Preserve values that the user has entered
    return {
      ...initialValues,
      ...currentValues,
      employment_status: employmentStatus
    };
  }, [employmentStatus, initialValues, currentValues]);

  return (
    <div>
      <Form
        fields={fields}
        initialValues={dynamicInitialValues}
        validate={validate}
        onSubmit={handleFormSubmit}
        submitLabel="Save and Continue"
        cancelLabel="Back"
        onCancel={handleCancel}
        fullWidthSubmit={false}
        showCancel={true}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}