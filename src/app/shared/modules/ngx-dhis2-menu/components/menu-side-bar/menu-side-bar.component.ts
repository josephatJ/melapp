import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PROFILE_MENUS } from '../../constants/profile-menus';
import { LOG_OUT } from '../../icons';
import { MenuService } from '../../services/menu.service';
import { NgxDhis2HttpClientService } from '../../../ngx-http-client/services/http-client.service';

@Component({
  selector: 'app-menu-side-bar',
  standalone: false,
  templateUrl: './menu-side-bar.component.html',
  styleUrls: ['./menu-side-bar.component.css'],
})
export class MenuSideBarComponent implements OnInit {
  @Input()
  rootUrl: string;
  showProfile: boolean;
  currentUser: any;
  currentUser$: Observable<any> | undefined;
  profileMenus: any[];
  apps: any[];
  originalApps: any[];
  loadingModules: boolean;
  filteredApp: string;
  showSidebarApps: boolean;
  logOutIcon: string;

  constructor(
    private menuService: MenuService,
    private httpClient: NgxDhis2HttpClientService
  ) {
    this.showProfile = false;
    this.rootUrl = '../../../';

    this.apps = [];
    this.originalApps = [];
    this.loadingModules = true;
    this.profileMenus = PROFILE_MENUS;
    this.filteredApp = '';
    this.showSidebarApps = false;
    this.logOutIcon = LOG_OUT;
  }

  ngOnInit() {
    this.currentUser$ = this.httpClient.me();

    this.menuService
      .getMenuModules(this.rootUrl)
      .subscribe((menuModules: any) => {
        if (menuModules !== null) {
          this.loadingModules = false;
          this.originalApps = [...menuModules];
          this.apps = this._prepareMenuModules();
        }
      });
  }

  private _prepareMenuModules() {
    return this.filteredApp === ''
      ? this.originalApps.filter((menu: any) => {
          return !menu.onlyShowOnSearch;
        })
      : this.originalApps;
  }

  toggleSidebarMenus(e: Event): void {
    e.stopPropagation();
    this.showSidebarApps = !this.showSidebarApps;
  }

  updateMenuModules() {
    this.apps = this._prepareMenuModules();
  }
}
