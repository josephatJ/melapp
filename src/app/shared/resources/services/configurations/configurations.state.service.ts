import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedConfigurationsStateService {
  private _configurations = signal<any>(null);
  configurations = this._configurations.asReadonly();

  updateConfigurations(configurations: any) {
    this._configurations.set(configurations);
  }
}
