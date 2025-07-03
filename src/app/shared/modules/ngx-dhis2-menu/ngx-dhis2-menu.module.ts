import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { MenuLoaderComponent } from './components/menu-loader/menu-loader.component';
import { MenuNotificationComponent } from './components/menu-notification/menu-notification.component';
import { MenuProfileComponent } from './components/menu-profile/menu-profile.component';
import { MenuSearchComponent } from './components/menu-search/menu-search.component';
import { MenuSideBarComponent } from './components/menu-side-bar/menu-side-bar.component';
import { MenuComponent } from './containers/menu/menu.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AbbreviatePipe } from './pipes/abbreviate.pipe';
import { ConvertToLighterColor } from './pipes/convert-to-lighter-color.pipe';
import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { MenuNotificationService } from './services/menu-notification.service';
import { MenuService } from './services/menu.service';
import { SystemStateService } from './services/system-state.service';
import { NgxDhis2HttpClientModule } from '../ngx-http-client/http-client.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FilterByNamePipe,
    AbbreviatePipe,
    ConvertToLighterColor,
    NgxDhis2HttpClientModule.forRoot({
      namespace: 'iapps',
      version: 1,
      models: {
        users: 'id',
        organisationUnitLevels: 'id',
        organisationUnits: 'id',
        organisationUnitGroups: 'id',
        dataStore_scorecards: 'id',
      },
    }),
  ],
  declarations: [
    MenuLoaderComponent,
    MenuProfileComponent,
    MenuSearchComponent,
    LoginFormComponent,
    MenuSideBarComponent,
    MenuNotificationComponent,
    MenuComponent,
    ClickOutsideDirective,
  ],
  providers: [MenuService, SystemStateService, MenuNotificationService],
  exports: [MenuComponent],
})
export class NgxDhis2MenuModule {}
