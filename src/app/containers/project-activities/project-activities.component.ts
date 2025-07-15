import { Component, computed, inject, signal } from '@angular/core';
import { keyBy } from 'lodash';
import { formulateFormFieldsBySections } from '../../shared/resources/helpers/generate-formfields.helper';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';
import { SharedProjectsStateService } from '../../shared/resources/services/projects/projects.state.service';
import { TrackerMetadataService } from '../../shared/resources/services/tracker-metadata.service';
import { NgxDhis2HttpClientService } from '../../shared/modules/ngx-http-client/services/http-client.service';
import { ActivatedRoute } from '@angular/router';
import { TrackerDataService } from '../../shared/resources/services/tracker-data.service';
import { FormDataModel } from '../../shared/models/form-data.model';
import { MenuItem } from 'primeng/api';
import {
  ACTIVITYPROGRAMID,
  DEFAULTTRACKEDFIELDS,
  LEVEL1ORGUNITID,
  PROJECTPROGRAMID,
  RELATIONSHIPTYPE_BETWEEN_ACTIVITY_AND_OBJECTIVE,
  RELATIONSHIPTYPE_BETWEEN_ACTIVITY_AND_PROJECT,
  RELATIONSHIPTYPEBETWEENOBJECTIVEANDPROJECT,
} from '../../shared/resources/app.constants';
import { map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { primengModules } from '../../shared/primeng.modules';
import { NgxFormComponent } from '../../shared/components/ngx-form/ngx-form.component';
import { SharedActivitiesStateService } from '../../shared/resources/services/activities/activities.state.service';
import { CustomField } from '../../shared/models/default-field.model';

@Component({
  selector: 'app-project-activities',
  imports: [CommonModule, ...primengModules, NgxFormComponent],
  templateUrl: './project-activities.component.html',
  styleUrl: './project-activities.component.scss',
})
export class ProjectActivitiesComponent {
  private userState = inject(SharedCurrentUserStateService);
  private projectsState = inject(SharedProjectsStateService);
  private activitiesState = inject(SharedActivitiesStateService);
  private trackerMetadataService = inject(TrackerMetadataService);
  private httpClientService = inject(NgxDhis2HttpClientService);
  private activatedRoute = inject(ActivatedRoute);
  private trackerDataService = inject(TrackerDataService);
  projectProgram = this.projectsState.projectProgram;
  activityProgram = this.activitiesState.activityProgram;
  currentUser = this.userState.currentUser;
  currentProject = this.projectsState.currentProject;
  activities = this.activitiesState.activities;
  currentActivity = this.activitiesState.currentActivity;

  formFieldsGroupedBySections = signal<any[]>([]);
  objectiveFormField!: CustomField;
  formData: FormDataModel = {
    data: {},
    isFormValid: false,
    formValidityBySection: {},
  };
  formValidityBySection: any = {};
  saving: boolean = false;
  routeId = signal<string>('new');
  selectedObjective = signal<any>(null);

  breadCrubItems = computed(() => [
    {
      label: this.currentProject()?.keyedAttributeValues['NAME']?.value,
      // routerLink: '/projects/' + this.currentProject()?.trackedEntity,
    },
    {
      label: 'Activities',
    },
  ]);
  home: MenuItem = {
    label: 'Projects',
    icon: 'pi pi-ticket',
    routerLink: '/projects',
  };
  showActivityFormDrawer: boolean = false;
  systemId$!: Observable<string>;

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.routeId.set(id);
      this.loadObjectivesRelationships();
      this.createFormMetadata();
      this.loadProjectProgram();
      this.loadActivities();
      this.loadSystemId();
    });
  }

  loadProjectProgram(): void {
    (!this.projectProgram()
      ? this.trackerMetadataService.getProgram(PROJECTPROGRAMID)
      : of(this.projectProgram())
    ).subscribe({
      next: (programResponse: { error: any }) => {
        if (!programResponse?.error) {
          this.projectsState.updateProjectProgram(programResponse);
        }
      },
    });
  }

  loadSystemId(): void {
    this.systemId$ = this.httpClientService.get(`system/id.json`).pipe(
      map((response: any) => {
        return response?.codes[0];
      })
    );
  }

  loadObjectivesRelationships(value?: any): void {
    this.trackerDataService
      .loadRelationshipsByTrackedEntity(this.routeId())
      .subscribe({
        next: (response) => {
          this.objectiveFormField = {
            id: 'objective',
            label: 'Specific Objective',
            type: 'DROPDOWN',
            value,
            disabled: value != null || value != undefined,
            options:
              (
                response?.filter(
                  (relationship: any) =>
                    relationship?.relationshipType ===
                    RELATIONSHIPTYPEBETWEENOBJECTIVEANDPROJECT
                ) || []
              )?.map((projectObjectiveRelationship: any) => {
                return {
                  id: projectObjectiveRelationship?.from?.trackedEntity
                    ?.trackedEntity,
                  label:
                    projectObjectiveRelationship?.keyedAttributeValues['CODE']
                      ?.value +
                    ': ' +
                    projectObjectiveRelationship?.keyedAttributeValues[
                      'SPECIFIC_OBJECTIVE'
                    ]?.value,
                  name:
                    projectObjectiveRelationship?.keyedAttributeValues['CODE']
                      ?.value +
                    ': ' +
                    projectObjectiveRelationship?.keyedAttributeValues[
                      'SPECIFIC_OBJECTIVE'
                    ]?.value,
                  code: projectObjectiveRelationship?.from?.trackedEntity
                    ?.trackedEntity,
                  value:
                    projectObjectiveRelationship?.from?.trackedEntity
                      ?.trackedEntity,
                };
              }) || [],
          };
        },
      });
  }

  createFormMetadata(): void {
    (!this.activityProgram()
      ? this.trackerMetadataService.getProgram(ACTIVITYPROGRAMID)
      : of(this.activityProgram())
    ).subscribe({
      next: (programResponse: { error: any }) => {
        if (!programResponse?.error) {
          this.activitiesState.updateActivityProgram(programResponse);
          if (this.routeId() === 'new') {
            this.activitiesState.updateCurrentActivity(null);
            this.formFieldsGroupedBySections.set(
              formulateFormFieldsBySections(
                programResponse,
                false,
                this.currentActivity(),
                null,
                false
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
                        this.currentActivity(),
                        null,
                        false
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
  }

  onGetObjective(formData: FormDataModel): void {
    this.selectedObjective.set(formData?.data['objective']?.value);
  }

  onSave(event: Event, trackedEntityId?: any): void {
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
      trackedEntity: this.currentActivity()
        ? this.currentActivity()?.trackedEntity
        : trackedEntityId,
      trackedEntityType: this.activityProgram()?.trackedEntityType?.id,
      orgUnit,
      attributes,
      programOwners: [
        {
          ownerOrgUnit: orgUnit,
          program: this.activityProgram()?.id,
        },
      ],
      relationships: this.currentActivity()
        ? this.currentActivity()?.relationships
        : [
            {
              from: {
                trackedEntity: {
                  trackedEntity: trackedEntityId,
                },
              },
              relationshipType: RELATIONSHIPTYPE_BETWEEN_ACTIVITY_AND_PROJECT,
              to: {
                trackedEntity: {
                  trackedEntity: this.routeId(),
                },
              },
            },
            {
              from: {
                trackedEntity: {
                  trackedEntity: trackedEntityId,
                },
              },
              relationshipType: RELATIONSHIPTYPE_BETWEEN_ACTIVITY_AND_OBJECTIVE,
              to: {
                trackedEntity: {
                  trackedEntity: this.selectedObjective(),
                },
              },
            },
          ],
    };

    let events: any[] = [];

    let enrollment: any = this.activitiesState.currentActivity()
      ? {
          ...this.currentActivity(),
          attributes,
          status: 'ACTIVE',
          program: this.activityProgram()?.id,
        }
      : {
          enrolledAt: new Date(),
          occurredAt: new Date(),
          program: this.activityProgram()?.id,
          orgUnit,
          status: 'ACTIVE',
          attributes,
          events,
        };

    if (this.activitiesState.currentActivity()) {
      data['trackedEntity'] =
        this.activitiesState.currentActivity()?.trackedEntity;
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
            this.showActivityFormDrawer = false;
            this.activitiesState.updateCurrentActivity(null);
            this.loadActivities();
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onSetCurrentActivity(event: Event, activity: any): void {
    event.stopPropagation();
    this.showActivityFormDrawer = true;
    this.activitiesState.updateCurrentActivity(activity);
    let value = '';
    const relationship = (activity?.relationships?.filter(
      (relationship: any) =>
        relationship?.relationshipType ===
        RELATIONSHIPTYPE_BETWEEN_ACTIVITY_AND_OBJECTIVE
    ) || [])[0];

    value = relationship?.to?.trackedEntity?.trackedEntity;
    this.loadObjectivesRelationships(value);
    this.formFieldsGroupedBySections.set(
      formulateFormFieldsBySections(
        this.activityProgram(),
        false,
        activity,
        null,
        false
      )
    );
  }

  loadActivities(): void {
    this.activitiesState.updateActivities(null);
    this.trackerDataService
      .searchTrackedEntities(
        ACTIVITYPROGRAMID,
        true,
        undefined,
        DEFAULTTRACKEDFIELDS + ',relationships',
        { paging: false }
      )
      .subscribe({
        next: (response: any) => {
          if (!response?.error) {
            this.activitiesState.updateActivities({
              ...response,
              trackedEntities: response?.trackedEntities?.map(
                (trackedEntityData: any, index: number) => {
                  return {
                    ...trackedEntityData,
                    sn: index + 1,
                    keyedAttributeValues: keyBy(
                      trackedEntityData?.attributes,
                      'code'
                    ),
                  };
                }
              ),
            });
          }
        },
      });
  }

  onAddActivity(event: Event): void {
    event.stopPropagation();
    if (this.currentActivity()) {
      this.formFieldsGroupedBySections.set([]);
    }
    this.activitiesState.updateCurrentActivity(null);
    this.showActivityFormDrawer = true;
  }
}
