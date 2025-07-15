import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NgxFormComponent } from '../../shared/components/ngx-form/ngx-form.component';
import { MenuItem } from 'primeng/api';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';
import { ActivatedRoute } from '@angular/router';
import { SharedProjectsStateService } from '../../shared/resources/services/projects/projects.state.service';
import { TrackerMetadataService } from '../../shared/resources/services/tracker-metadata.service';
import { NgxDhis2HttpClientService } from '../../shared/modules/ngx-http-client/services/http-client.service';
import { TrackerDataService } from '../../shared/resources/services/tracker-data.service';
import { FormDataModel } from '../../shared/models/form-data.model';
import { primengModules } from '../../shared/primeng.modules';
import {
  DEFAULTTRACKEDFIELDS,
  LEVEL1ORGUNITID,
  PROJECTOBJECTIVESPROGRAMID,
  PROJECTPROGRAMID,
  RELATIONSHIPTYPEBETWEENOBJECTIVEANDPROJECT,
} from '../../shared/resources/app.constants';
import { map, Observable, of } from 'rxjs';
import { formulateFormFieldsBySections } from '../../shared/resources/helpers/generate-formfields.helper';
import { keyBy } from 'lodash';
import { SharedProjectObjectivesStateService } from '../../shared/resources/services/project-objectives/project-objectives.state';

@Component({
  selector: 'app-project-objectives',
  imports: [CommonModule, ...primengModules, NgxFormComponent],
  templateUrl: './project-objectives.component.html',
  styleUrl: './project-objectives.component.scss',
})
export class ProjectObjectivesComponent {
  private userState = inject(SharedCurrentUserStateService);
  private projectsState = inject(SharedProjectsStateService);
  private objectivesState = inject(SharedProjectObjectivesStateService);
  private trackerMetadataService = inject(TrackerMetadataService);
  private httpClientService = inject(NgxDhis2HttpClientService);
  private activatedRoute = inject(ActivatedRoute);
  private trackerDataService = inject(TrackerDataService);
  projectProgram = this.projectsState.projectProgram;
  objectiveProgram = this.objectivesState.objectiveProgram;
  currentUser = this.userState.currentUser;
  currentProject = this.projectsState.currentProject;
  currentObjective = this.objectivesState.currentObjective;
  objectives = this.objectivesState.objectives;

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
  systemId$!: Observable<string>;

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.routeId.set(id);
      this.createFormMetadata();
      this.loadObjectives();
      this.loadProjectProgram();
      this.loadSystemId();
    });
  }

  loadSystemId(): void {
    this.systemId$ = this.httpClientService.get(`system/id.json`).pipe(
      map((response: any) => {
        return response?.codes[0];
      })
    );
  }

  createFormMetadata(): void {
    (!this.objectiveProgram()
      ? this.trackerMetadataService.getProgram(PROJECTOBJECTIVESPROGRAMID)
      : of(this.objectiveProgram())
    ).subscribe({
      next: (programResponse) => {
        if (!programResponse?.error) {
          this.objectivesState.updateObjectiveProgram(programResponse);
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
                      this.currentObjective(),
                      null,
                      false
                    )
                  );
                }
              },
            });
        } else {
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadProjectProgram(): void {
    (!this.projectProgram()
      ? this.trackerMetadataService.getProgram(PROJECTPROGRAMID)
      : of(this.projectProgram())
    ).subscribe({
      next: (programResponse) => {
        if (!programResponse?.error) {
          this.projectsState.updateProjectProgram(programResponse);
        }
      },
    });
  }

  onGetFormData(formData: FormDataModel, id: string): void {
    this.formData.data = { ...(this.formData?.data || {}), ...formData?.data };
    this.formData.isFormValid = formData?.isFormValid;
    this.formData.formValidityBySection[id] = formData?.isFormValid;

    // console.log(formData);
  }

  onSave(event: Event, trackedEntityId: any): void {
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
      trackedEntity: this.currentObjective()
        ? this.currentObjective()?.trackedEntity
        : trackedEntityId,
      trackedEntityType: this.objectiveProgram()?.trackedEntityType?.id,
      orgUnit,
      attributes,
      programOwners: [
        {
          ownerOrgUnit: orgUnit,
          program: this.objectiveProgram()?.id,
        },
      ],
      relationships: this.currentObjective()
        ? this.currentObjective()?.relationships
        : [
            {
              from: {
                trackedEntity: {
                  trackedEntity: this.currentObjective()
                    ? this.currentObjective()?.trackedEntity
                    : trackedEntityId,
                },
              },
              relationshipType: RELATIONSHIPTYPEBETWEENOBJECTIVEANDPROJECT,
              to: {
                trackedEntity: {
                  trackedEntity: this.routeId(),
                },
              },
            },
          ],
    };

    let events: any[] = [];

    let enrollment: any = this.currentObjective()
      ? {
          ...this.currentObjective()?.enrollments[0],
          attributes,
          status: 'ACTIVE',
          program: this.objectiveProgram()?.id,
        }
      : {
          enrolledAt: new Date(),
          occurredAt: new Date(),
          program: this.objectiveProgram()?.id,
          orgUnit,
          status: 'ACTIVE',
          attributes,
          events,
        };

    if (this.objectivesState.currentObjective()) {
      data['trackedEntity'] =
        this.objectivesState.currentObjective()?.trackedEntity;
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
            this.showObjectiveFormDrawer = false;
            this.objectivesState.updateCurrentObjective(null);
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
    this.objectivesState.updateCurrentObjective(objective);
    this.formFieldsGroupedBySections.set(
      formulateFormFieldsBySections(
        this.objectiveProgram(),
        false,
        objective,
        null,
        false
      )
    );
  }

  loadObjectives(): void {
    this.objectivesState.updateObjectives(null);
    this.trackerDataService
      .searchTrackedEntities(
        PROJECTOBJECTIVESPROGRAMID,
        true,
        undefined,
        DEFAULTTRACKEDFIELDS + ',relationships',
        { paging: false }
      )
      .subscribe({
        next: (response: any) => {
          if (!response?.error) {
            this.objectivesState.updateObjectives({
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

  onAddNewObjective(event: Event): void {
    event.stopPropagation();
    if (this.currentObjective()) {
      this.formFieldsGroupedBySections.set([]);
    }
    this.objectivesState.updateCurrentObjective(null);

    this.createFormMetadata();
    this.showObjectiveFormDrawer = true;
  }
}
