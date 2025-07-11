import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { primengModules } from '../../shared/primeng.modules';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';
import { Router } from '@angular/router';
import { SharedProjectsStateService } from '../../shared/resources/services/projects/projects.state.service';
import { TrackerMetadataService } from '../../shared/resources/services/tracker-metadata.service';
import {
  DEFAULTTRACKEDFIELDS,
  PROJECTPROGRAMID,
} from '../../shared/resources/app.constants';
import { of } from 'rxjs';
import { TrackerDataService } from '../../shared/resources/services/tracker-data.service';
import { keyBy } from 'lodash';
import moment from 'moment';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ...primengModules],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private userState = inject(SharedCurrentUserStateService);
  private router = inject(Router);
  private projectsState = inject(SharedProjectsStateService);
  private trackerMetadataService = inject(TrackerMetadataService);
  private trackerDataService = inject(TrackerDataService);
  projectProgram = this.projectsState.projectProgram;
  projectsPayload = this.projectsState.projectsPayload;

  currentUser = this.userState.currentUser;

  constructor() {
    (!this.projectProgram()
      ? this.trackerMetadataService.getProgram(PROJECTPROGRAMID)
      : of(this.projectProgram())
    ).subscribe({
      next: (programResponse) => {
        this.projectsState.updateProjectProgram(programResponse);
      },
    });
    this.loadProjectsList();
  }

  loadProjectsList(): void {
    this.trackerDataService
      .searchTrackedEntities(
        PROJECTPROGRAMID,
        undefined,
        DEFAULTTRACKEDFIELDS,
        { paging: false }
      )
      .subscribe({
        next: (response) => {
          if (!response?.error) {
            let formattedPayload = {
              ...response,
              trackedEntities: response?.trackedEntities?.map(
                (trackedEntityData: any) => {
                  const keyedAttributeValues = keyBy(
                    trackedEntityData?.attributes,
                    'code'
                  );
                  const lastUpdatedText = `Updated ${moment(
                    trackedEntityData.lastUpdated
                  ).fromNow()}`;
                  return {
                    ...trackedEntityData,
                    lastUpdatedText,
                    keyedAttributeValues,
                    menuItems: [
                      {
                        label: 'Options',
                        items: [
                          {
                            label: 'Edit',
                            icon: 'pi pi-pencil',
                            command: (event: any) => {
                              this.projectsState.updateCurrentProject({
                                ...trackedEntityData,
                                keyedAttributeValues,
                              });
                              this.router.navigate([
                                '/projects/' + trackedEntityData?.trackedEntity,
                              ]);
                            },
                          },
                        ],
                      },
                    ],
                  };
                }
              ),
            };
            this.projectsState.updateProjects(formattedPayload);
          }
        },
      });
  }

  onChangeRoute(event: Event, path: string): void {
    event.stopPropagation();
    this.router.navigate([path]);
  }
}
