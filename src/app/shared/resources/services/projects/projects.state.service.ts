// dashboard
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedProjectsStateService {
  private _projects = signal<any[]>([]);
  projects = this._projects.asReadonly();

  updateProjects(projects: any[]) {
    this._projects.set(projects);
  }
}
