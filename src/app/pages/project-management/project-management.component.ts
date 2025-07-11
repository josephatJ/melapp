import { Component, inject, signal } from '@angular/core';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedProjectsStateService } from '../../shared/resources/services/projects/projects.state.service';
import { TrackerMetadataService } from '../../shared/resources/services/tracker-metadata.service';
import {
  LEVEL1ORGUNITID,
  PROJECTPROGRAMID,
} from '../../shared/resources/app.constants';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { primengModules } from '../../shared/primeng.modules';
import { formulateFormFieldsBySections } from '../../shared/resources/helpers/generate-formfields.helper';
import { NgxFormComponent } from '../../shared/components/ngx-form/ngx-form.component';
import { FormDataModel } from '../../shared/models/form-data.model';
import { NgxDhis2HttpClientService } from '../../shared/modules/ngx-http-client/services/http-client.service';
import { TrackerDataService } from '../../shared/resources/services/tracker-data.service';
import moment from 'moment';
import { keyBy } from 'lodash';

@Component({
  selector: 'app-project-management',
  imports: [CommonModule, ...primengModules, NgxFormComponent],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss',
})
export class ProjectManagementComponent {
  private userState = inject(SharedCurrentUserStateService);
  private router = inject(Router);
  private projectsState = inject(SharedProjectsStateService);
  private trackerMetadataService = inject(TrackerMetadataService);
  private httpClientService = inject(NgxDhis2HttpClientService);
  private activatedRoute = inject(ActivatedRoute);
  private trackerDataService = inject(TrackerDataService);
  projectProgram = this.projectsState.projectProgram;
  currentUser = this.userState.currentUser;
  currentProject = this.projectsState.currentProject;

  formFieldsGroupedBySections = signal<any[]>([]);
  formData: FormDataModel = {
    data: {},
    isFormValid: false,
    formValidityBySection: {},
  };
  formValidityBySection: any = {};
  saving: boolean = false;
  routeId = signal<string>('new');

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.routeId.set(id);
      this.createFormMetadata();
    });
  }

  createFormMetadata(): void {
    (!this.projectProgram()
      ? this.trackerMetadataService.getProgram(PROJECTPROGRAMID)
      : of(this.projectProgram())
    ).subscribe({
      next: (programResponse) => {
        if (!programResponse?.error) {
          this.projectsState.updateProjectProgram(programResponse);
          if (this.routeId() === 'new') {
            this.projectsState.updateCurrentProject(null);
            this.formFieldsGroupedBySections.set(
              formulateFormFieldsBySections(
                programResponse,
                this.currentProject()
              )
            );
          } else {
            this.trackerDataService
              .loadTrackedEntityDetails(this.routeId())
              .subscribe({
                next: (response) => {
                  if (!response?.error) {
                    const keyedAttributeValues = keyBy(
                      response?.attributes,
                      'code'
                    );
                    this.projectsState.updateCurrentProject({
                      ...response,
                      keyedAttributeValues,
                    });
                    this.formFieldsGroupedBySections.set(
                      formulateFormFieldsBySections(programResponse, {
                        ...response,
                        keyedAttributeValues,
                      })
                    );
                  }
                },
              });
          }
        } else {
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onGetFormData(formData: FormDataModel, id: string): void {
    this.formData.data = { ...(this.formData?.data || {}), ...formData?.data };
    this.formData.isFormValid = formData?.isFormValid;
    this.formData.formValidityBySection[id] = formData?.isFormValid;

    console.log(formData);
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;

    let keyedAutofedFields: any = {};

    const attributes: any[] =
      (
        Object.keys(this.formData?.data).map((attribute: string) => {
          return {
            attribute,
            value:
              (this.formData.data as any)[attribute]?.field?.type !== 'USERNAME'
                ? !keyedAutofedFields[attribute]
                  ? (this.formData.data as any)[attribute]?.value
                  : (this.formData?.data as any)[
                      keyedAutofedFields[attribute]?.source?.id
                    ]?.value?.id
                : (this.formData.data as any)[attribute]?.value?.username,
          };
        }) || []
      )?.filter((attributeValue: any) => attributeValue?.value) || [];
    const orgUnit = LEVEL1ORGUNITID;
    let data: any = {
      trackedEntityType: this.projectProgram()?.trackedEntityType?.id,
      orgUnit,
      attributes,
      programOwners: [
        {
          ownerOrgUnit: orgUnit,
          program: this.projectProgram()?.id,
        },
      ],
    };

    let events: any[] = [];

    let enrollment: any =
      this.projectsState.currentProject() && this.routeId() !== 'new'
        ? {
            ...this.projectsState.currentProject()?.enrollments[0],
            attributes,
          }
        : {
            enrolledAt: new Date(),
            occurredAt: new Date(),
            program: this.projectProgram()?.id,
            orgUnit,
            status: 'ACTIVE',
            attributes,
            events,
          };

    if (this.projectsState.currentProject() && this.routeId() !== 'new') {
      data['trackedEntity'] =
        this.projectsState.currentProject()?.trackedEntity;
    }

    data['enrollments'] = [enrollment];

    this.httpClientService
      .post(`tracker?async=false`, {
        trackedEntities: [data],
      })
      .subscribe({
        next: (response) => {
          if (!response?.error) {
            this.saving = false;
            this.createFormMetadata();
            this.router.navigate(['/projects']);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
