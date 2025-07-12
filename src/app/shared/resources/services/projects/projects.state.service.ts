// dashboard
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedProjectsStateService {
  private _projectsPayload = signal<any>(null);
  projectsPayload = this._projectsPayload.asReadonly();
  private _projectProgram = signal<any>(null);
  projectProgram = this._projectProgram.asReadonly();
  private _currentProjectEnrollments = signal<any>(null);
  currentProjectEnrollments = this._currentProjectEnrollments.asReadonly();
  private _currentProjectEnrollment = signal<any>(null);
  currentProjectEnrollment = this._currentProjectEnrollment.asReadonly();

  private _currentProject = signal<any>(null);
  currentProject = this._currentProject.asReadonly();

  updateProjects(projectsPayload: any) {
    this._projectsPayload.set(projectsPayload);
  }

  updateProjectProgram(program: any) {
    this._projectProgram.set(program);
  }

  updateCurrentProject(project: any) {
    this._currentProject.set(project);
  }

  updateCurrentProjectEnrollments(projectEnrollments: any) {
    this._currentProjectEnrollments.set(projectEnrollments);
  }

  updateCurrentProjectEnrollment(projectEnrollment: any) {
    this._currentProjectEnrollment.set(projectEnrollment);
  }
}
