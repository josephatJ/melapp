import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NgxFormComponent } from '../../shared/components/ngx-form/ngx-form.component';
import { MenuItem } from 'primeng/api';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedProjectsStateService } from '../../shared/resources/services/projects/projects.state.service';
import { TrackerMetadataService } from '../../shared/resources/services/tracker-metadata.service';
import { NgxDhis2HttpClientService } from '../../shared/modules/ngx-http-client/services/http-client.service';
import { TrackerDataService } from '../../shared/resources/services/tracker-data.service';
import { FormDataModel } from '../../shared/models/form-data.model';
import { primengModules } from '../../shared/primeng.modules';
import {
  LEVEL1ORGUNITID,
  PROJECTPROGRAMID,
} from '../../shared/resources/app.constants';
import { of } from 'rxjs';
import { formulateFormFieldsBySections } from '../../shared/resources/helpers/generate-formfields.helper';
import { keyBy } from 'lodash';

@Component({
  selector: 'app-project-objectives',
  imports: [CommonModule, ...primengModules, NgxFormComponent],
  templateUrl: './project-objectives.component.html',
  styleUrl: './project-objectives.component.scss',
})
export class ProjectObjectivesComponent {
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
  objectives = this.projectsState.currentProjectEnrollments;

  formFieldsGroupedBySections = signal<any[]>([]);
  formData: FormDataModel = {
    data: {},
    isFormValid: false,
    formValidityBySection: {},
  };
  formValidityBySection: any = {};
  saving: boolean = false;
  routeId = signal<string>('new');

  breadCrubItems = computed(() => [
    {
      label: this.currentProject()?.keyedAttributeValues['NAME']?.value,
      // routerLink: '/projects/' + this.currentProject()?.trackedEntity,
    },
    {
      label: 'Objectives',
    },
  ]);
  home: MenuItem = {
    label: 'Projects',
    icon: 'pi pi-ticket',
    routerLink: '/projects',
  };
  showObjectiveFormDrawer: boolean = false;

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.routeId.set(id);
      this.createFormMetadata();
      this.loadObjectives();
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
                false,
                this.currentProject(),
                null,
                true
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
                      formulateFormFieldsBySections(
                        programResponse,
                        false,
                        {
                          ...response,
                          keyedAttributeValues,
                        },
                        null,
                        true
                      )
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

    // console.log(formData);
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;

    let keyedAutofedFields: any = {};

    let attributes: any[] =
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

    let events: any[] = this.projectsState.currentProjectEnrollment()
      ? this.projectsState.currentProjectEnrollment()?.events
      : [];

    let enrollment: any = this.projectsState.currentProjectEnrollment()
      ? {
          ...this.projectsState.currentProjectEnrollment(),
          attributes,
        }
      : {
          enrolledAt: new Date(),
          occurredAt: new Date(),
          program: this.projectProgram()?.id,
          orgUnit,
          status: 'ACTIVE',
          attributes: [...this.currentProject()?.attributes, ...attributes],
          events,
        };

    if (this.projectsState.currentProject() && this.routeId() !== 'new') {
      data['trackedEntity'] =
        this.projectsState.currentProject()?.trackedEntity;
    }

    if (
      !this.projectsState.currentProjectEnrollments() ||
      this.projectsState.currentProjectEnrollments()?.length === 0
    ) {
      data['enrollments'] = [enrollment];
    } else {
      data['enrollments'] = [
        ...(this.projectsState?.currentProjectEnrollment()
          ? this.projectsState
              .currentProjectEnrollments()
              ?.filter(
                (enrollment: any) =>
                  enrollment?.enrollment !==
                  this.projectsState?.currentProjectEnrollment()?.enrollment
              ) || []
          : this.projectsState.currentProjectEnrollments() || []),
        enrollment,
      ];
    }

    this.httpClientService
      .post(`tracker?async=false`, {
        trackedEntities: [data],
      })
      .subscribe({
        next: (response) => {
          if (!response?.error) {
            this.saving = false;
            this.createFormMetadata();
            this.showObjectiveFormDrawer = false;
            this.projectsState.updateCurrentProjectEnrollment(null);
            this.loadObjectives();
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onSetCurrentObjective(event: Event, objective: any): void {
    event.stopPropagation();
    this.showObjectiveFormDrawer = true;
    this.projectsState.updateCurrentProjectEnrollment(objective);
    this.formFieldsGroupedBySections.set(
      formulateFormFieldsBySections(
        this.projectProgram(),
        false,
        objective,
        null,
        true
      )
    );
  }

  loadObjectives(): void {
    this.projectsState.updateCurrentProjectEnrollments(null);
    this.trackerDataService.loadTrackedEntityDetails(this.routeId()).subscribe({
      next: (response) => {
        if (!response?.error) {
          console.log(response?.enrollments);
          this.projectsState.updateCurrentProjectEnrollments(
            response?.enrollments?.map((enrollment: any, index: number) => {
              return {
                ...enrollment,
                sn: index + 1,
                keyedAttributeValues: keyBy(enrollment?.attributes, 'code'),
              };
            })
          );
        }
      },
    });
  }
}
