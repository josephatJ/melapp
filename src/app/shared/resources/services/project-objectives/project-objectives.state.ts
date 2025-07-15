import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedProjectObjectivesStateService {
  private _objectiveProgram = signal<any>(null);
  objectiveProgram = this._objectiveProgram.asReadonly();

  private _currentObjective = signal<any>(null);
  currentObjective = this._currentObjective.asReadonly();

  private _objectives = signal<any>(null);
  objectives = this._objectives.asReadonly();

  updateObjectives(objectives: any) {
    this._objectives.set(objectives);
  }

  updateObjectiveProgram(program: any) {
    this._objectiveProgram.set(program);
  }

  updateCurrentObjective(objective: any) {
    this._currentObjective.set(objective);
  }
}
