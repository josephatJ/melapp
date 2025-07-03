import { CustomField } from '../../models/default-field.model';

export function determinFormValidity(
  keyedValues: any,
  formFields: CustomField[]
): boolean {
  let isFormValid: boolean =
    (
      formFields?.filter(
        (formField: CustomField) =>
          formField?.required &&
          keyedValues[formField?.id]?.value &&
          keyedValues[formField?.id]?.value != ''
      ) || []
    )?.length ===
    (formFields?.filter((formField: CustomField) => formField?.required) || [])
      ?.length;
  return isFormValid;
}
