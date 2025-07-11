import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedConfigurationsStateService {
  private _configurations = signal<any>(null);
  configurations = this._configurations.asReadonly();

  private _optionSets = signal<any>({});
  optionSets = this._optionSets.asReadonly();

  updateConfigurations(configurations: any) {
    this._configurations.set(configurations);
  }

  updateOptionSets(optionSets: any) {
    this._optionSets.set(optionSets);
  }
}
