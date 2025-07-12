import { keyBy } from 'lodash';
import { generateTwoYearsOptions } from './format-dates.helper';

export function formulateFormFieldsBySections(
  programDetails: any,
  byTrackedEntityType: boolean,
  trackedData?: any,
  configurations?: any,
  excludeTrackedEntityType?: boolean
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
  const keyedTrackedEntityTypeAttributes: any = keyBy(
    programDetails?.trackedEntityType?.trackedEntityTypeAttributes?.map(
      (trackedEntityTypeAttribute: any) => {
        return trackedEntityTypeAttribute?.trackedEntityAttribute;
      }
    ),
    'id'
  );

  let formFieldsBySections: any[] = !byTrackedEntityType
    ? programDetails?.programSections?.map((programSection: any) => {
        return {
          id: programSection?.id,
          name: programSection?.name,
          description: programSection?.description,
          formFields: [
            configurations?.appointmentDateFieldSection?.id ===
            programSection?.id
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
            ...(
              programSection?.trackedEntityAttributes?.filter(
                (trackedEntityAttribute: any) => {
                  if (
                    excludeTrackedEntityType &&
                    keyedTrackedEntityTypeAttributes[trackedEntityAttribute?.id]
                  ) {
                    return null;
                  } else {
                    return trackedEntityAttribute;
                  }
                }
              ) || []
            )?.map((trackedEntityAttribute: any) => {
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
            }),
          ]?.filter((formField: any) => formField),
        };
      })
    : [
        {
          id: programDetails?.trackedEntityType?.id,
          name: programDetails?.trackedEntityType?.name,
          formFields:
            programDetails?.trackedEntityType?.trackedEntityTypeAttributes?.map(
              (trackedEntityTypeAttribute: any) => {
                return {
                  id: trackedEntityTypeAttribute?.trackedEntityAttribute?.id,
                  label: trackedEntityTypeAttribute?.trackedEntityAttribute
                    ?.formName
                    ? trackedEntityTypeAttribute?.trackedEntityAttribute
                        ?.formName
                    : trackedEntityTypeAttribute?.trackedEntityAttribute?.name,
                  type:
                    trackedEntityTypeAttribute?.trackedEntityAttribute?.code ===
                      'YEAR' ||
                    trackedEntityTypeAttribute?.trackedEntityAttribute
                      ?.optionSet
                      ? 'DROPDOWN'
                      : trackedEntityTypeAttribute?.trackedEntityAttribute
                          ?.valueType,
                  required:
                    keyedProgramTrackedEntityAttribute[
                      trackedEntityTypeAttribute?.trackedEntityAttribute?.id
                    ]?.mandatory,
                  mask:
                    trackedEntityTypeAttribute?.trackedEntityAttribute
                      ?.valueType === 'PHONE_NUMBER'
                      ? '9999-999-999'
                      : null,
                  options: trackedEntityTypeAttribute?.trackedEntityAttribute
                    ?.optionSet
                    ? trackedEntityTypeAttribute?.trackedEntityAttribute?.optionSet?.options?.map(
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
                    : trackedEntityTypeAttribute?.trackedEntityAttribute
                        ?.code === 'YEAR'
                    ? generateTwoYearsOptions(new Date().getFullYear())
                    : [],
                  value: trackedData
                    ? trackedEntityTypeAttribute?.trackedEntityAttribute
                        ?.valueType !== 'DATE'
                      ? trackedData?.keyedAttributeValues[
                          trackedEntityTypeAttribute?.trackedEntityAttribute
                            ?.code
                        ]?.value
                      : trackedData?.keyedAttributeValues[
                          trackedEntityTypeAttribute?.trackedEntityAttribute
                            ?.code
                        ] &&
                        trackedData?.keyedAttributeValues[
                          trackedEntityTypeAttribute?.trackedEntityAttribute
                            ?.code
                        ]?.value
                      ? new Date(
                          trackedData?.keyedAttributeValues[
                            trackedEntityTypeAttribute?.trackedEntityAttribute?.code
                          ]?.value
                        )
                      : null
                    : null,
                  disabled: keyedAutofedFields[
                    trackedEntityTypeAttribute?.trackedEntityAttribute?.id
                  ]
                    ? true
                    : false,
                };
              }
            ),
        },
      ];
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
