import { keyBy } from 'lodash';
import { generateTwoYearsOptions } from './format-dates.helper';

export function formulateFormFieldsBySections(
  programDetails: any,
  trackedData?: any,
  configurations?: any
): any {
  const keyedProgramTrackedEntityAttribute: any = keyBy(
    programDetails?.programTrackedEntityAttributes?.map(
      (programTrackedEntityAttribute: any) => {
        return {
          ...programTrackedEntityAttribute,
          attribute: programTrackedEntityAttribute?.trackedEntityAttribute?.id,
        };
      }
    ),
    'attribute'
  );

  const keyedAutofedFields: any = configurations
    ? keyBy(configurations?.autofedTrackedEntityAttributes, 'id')
    : {};

  let formFieldsBySections: any[] = programDetails?.programSections?.map(
    (programSection: any) => {
      return {
        id: programSection?.id,
        name: programSection?.name,
        description: programSection?.description,
        formFields: [
          configurations?.appointmentDateFieldSection?.id === programSection?.id
            ? {
                id: 'appointmentDate',
                label: 'Appointment date',
                type: 'DATE',
                required: true,
                max: new Date(),
                value: trackedData?.appointmentDate
                  ? new Date(trackedData?.appointmentDate)
                  : null,
              }
            : null,
          ...programSection?.trackedEntityAttributes?.map(
            (trackedEntityAttribute: any) => {
              return {
                id: trackedEntityAttribute?.id,
                label: trackedEntityAttribute?.formName
                  ? trackedEntityAttribute?.formName
                  : trackedEntityAttribute?.name,
                type:
                  trackedEntityAttribute?.code === 'YEAR' ||
                  trackedEntityAttribute?.optionSet
                    ? 'DROPDOWN'
                    : trackedEntityAttribute?.valueType,
                required:
                  keyedProgramTrackedEntityAttribute[trackedEntityAttribute?.id]
                    ?.mandatory,
                mask:
                  trackedEntityAttribute?.valueType === 'PHONE_NUMBER'
                    ? '9999-999-999'
                    : null,
                options: trackedEntityAttribute?.optionSet
                  ? trackedEntityAttribute?.optionSet?.options?.map(
                      (option: any) => {
                        return {
                          id: option?.id,
                          code: option?.code,
                          name: option?.name,
                          label: option?.name,
                          value: option?.code,
                        };
                      }
                    )
                  : trackedEntityAttribute?.code === 'YEAR'
                  ? generateTwoYearsOptions(new Date().getFullYear())
                  : [],
                value: trackedData
                  ? trackedEntityAttribute?.valueType !== 'DATE'
                    ? trackedData?.keyedAttributeValues[
                        trackedEntityAttribute?.code
                      ]?.value
                    : trackedData?.keyedAttributeValues[
                        trackedEntityAttribute?.code
                      ] &&
                      trackedData?.keyedAttributeValues[
                        trackedEntityAttribute?.code
                      ]?.value
                    ? new Date(
                        trackedData?.keyedAttributeValues[
                          trackedEntityAttribute?.code
                        ]?.value
                      )
                    : null
                  : null,
                disabled: keyedAutofedFields[trackedEntityAttribute?.id]
                  ? true
                  : false,
              };
            }
          ),
        ]?.filter((formField: any) => formField),
      };
    }
  );
  return formFieldsBySections;
}

export function formulateProgramStageFormFieldsBySection(
  programStage: any,
  programStageEvent: any
): any[] {
  let formFieldsBySections: any[] = programStage?.programStageSections?.map(
    (programStageSection: any) => {
      return {
        id: programStageSection?.id,
        name: programStageSection?.name,
        description: programStageSection?.description,
        formFields: programStageSection?.dataElements?.map(
          (dataElement: any) => {
            return {
              id: dataElement?.id,
              key: dataElement?.id,
              label: dataElement?.formName
                ? dataElement?.formName
                : dataElement?.name,
              rows: dataElement?.valueType === 'LONG_TEXT' ? 2 : null,
              type: !dataElement?.optionSet
                ? dataElement?.valueType
                : 'DROPDOWN',
              options: dataElement?.optionSet
                ? dataElement?.optionSet?.options?.map((option: any) => {
                    return {
                      id: option?.id,
                      code: option?.code,
                      label: option?.name,
                      value: option?.code,
                    };
                  })
                : [],
            };
          }
        ),
      };
    }
  );
  return formFieldsBySections;
}
