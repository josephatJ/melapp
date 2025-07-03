import { CommonModule } from '@angular/common';
import { Component, computed, inject, resource, signal } from '@angular/core';
import { primengModules } from '../../shared/primeng.modules';
import { NgxFormComponent } from '../../shared/components/ngx-form/ngx-form.component';
import { CustomField } from '../../shared/models/default-field.model';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';
import { ActivatedRoute } from '@angular/router';
import { NgxDhis2HttpClientService } from '../../shared/modules/ngx-http-client/services/http-client.service';
import { FormDataModel } from '../../shared/models/form-data.model';

@Component({
  selector: 'app-staff-management',
  imports: [CommonModule, ...primengModules, NgxFormComponent],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.scss',
})
export class StaffManagementComponent {
  private userState = inject(SharedCurrentUserStateService);
  currentUser = this.userState.currentUser;
  private activateRoute = inject(ActivatedRoute);
  private http = inject(NgxDhis2HttpClientService);

  // Signal to track route id
  private routeId = signal<string | null>(
    this.activateRoute.snapshot.paramMap.get('id')
  );

  // Signal to hold form metadata fetched from API
  private formMetadata = signal<CustomField[]>([]);

  constructor() {
    // Watch for route changes
    this.activateRoute.params.subscribe((params) => {
      const id = params['id'];
      this.routeId.set(id);

      // Fetch metadata when route ID changes
      this.fetchFormMetadata();
    });
  }

  private fetchFormMetadata() {
    const id = this.routeId();
    const apiUrl =
      'programs/WCkGnb4crgS.json?fields=id,name,code,' +
      'programTrackedEntityAttributes[mandatory,displayInList,' +
      'trackedEntityAttribute[id,name,valueType,formName,optionSet' +
      '[options[id,name,code]]]],programStages[*]';

    this.http.get(apiUrl).subscribe({
      next: (programData: any) => {
        // console.log(programData);
        const fields = programData?.programTrackedEntityAttributes?.map(
          (programTrackedEntityAttribute: any) => {
            return {
              id: programTrackedEntityAttribute?.trackedEntityAttribute?.id,
              label: programTrackedEntityAttribute?.trackedEntityAttribute
                ?.formName
                ? programTrackedEntityAttribute?.trackedEntityAttribute
                    ?.formName
                : programTrackedEntityAttribute?.trackedEntityAttribute?.name,
              type: programTrackedEntityAttribute?.trackedEntityAttribute
                ?.optionSet
                ? 'DROPDOWN'
                : programTrackedEntityAttribute?.trackedEntityAttribute
                    ?.valueType,
              required: programTrackedEntityAttribute?.mandatory,
              mask:
                programTrackedEntityAttribute?.trackedEntityAttribute
                  ?.valueType === 'PHONE_NUMBER'
                  ? '9999-999-999'
                  : null,
              options: programTrackedEntityAttribute?.trackedEntityAttribute
                ?.optionSet
                ? programTrackedEntityAttribute?.trackedEntityAttribute?.optionSet?.options?.map(
                    (option: any) => {
                      return {
                        id: option?.id,
                        code: option?.code,
                        label: option?.name,
                        value: option?.code,
                      };
                    }
                  )
                : [],
            };
          }
        );
        this.formMetadata.set(fields);
      },
      error: () => this.formMetadata.set([]),
    });
  }

  onGetFormData(formData: FormDataModel): void {
    console.log(formData);
  }

  // Optionally enrich form with user defaults if editing
  formFields = computed(() => {
    const isNew = this.routeId() === 'new';
    const user = this.currentUser();
    const fields = this.formMetadata();

    return fields.map((field) => {
      if (isNew) {
        return { ...field, value: null };
      }

      // Override value from user only if editing
      if (field.id === 'firstname') {
        return { ...field, value: user?.firstName ?? '' };
      }
      if (field.id === 'lastname') {
        return { ...field, value: user?.surname ?? '' };
      }
      return field;
    });
  });
}
