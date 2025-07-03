import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MENU_BACKGROUND_COLORS } from '../../constants/menu-background-colors';
import { SystemStateService } from '../../services/system-state.service';
import { NgxDhis2HttpClientService } from '../../../ngx-http-client/services/http-client.service';

@Component({
  selector: 'ngx-dhis2-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('open', [
      state(
        'in',
        style({
          opacity: 1,
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
        }),
        animate(700),
      ]),
      transition('* => void', [
        animate(400),
        style({
          opacity: 0,
        }),
      ]),
    ]),
  ],
})
export class MenuComponent implements OnInit {
  rootUrl: string;
  applicationTitle!: string;
  backgroundColor: string;
  menuLoading: boolean;
  menuLoadingFail: boolean;
  loggedIn$: Observable<boolean>;
  online: boolean;
  menuNotification: string;
  wasOffline: boolean;
  showSidebar: boolean;
  contextPath!: string;

  constructor(
    private httpClient: NgxDhis2HttpClientService,
    private systemStatusService: SystemStateService
  ) {
    this.rootUrl = '../../../';
    this.menuLoading = true;
    this.menuLoadingFail = false;
    this.loggedIn$ = this.systemStatusService.getLoginStatus();
    this.online = false;
    this.menuNotification = '';
    this.wasOffline = true;
    this.backgroundColor = '#ECECEC';
    this.showSidebar = false;
  }

  ngOnInit() {
    this.systemStatusService.checkOnlineStatus().subscribe((onlineStatus) => {
      this.online = onlineStatus;
      if (this.online && this.wasOffline) {
        this.menuNotification = 'You are online';
        this.wasOffline = false;

        /**
         * Hide notification status after sometimes
         */
        setTimeout(() => {
          this.menuNotification = '';
        }, 3000);

        /**
         * Load system settings if failed
         */
        if (this.menuLoadingFail) {
          this.menuLoading = true;
          this.getSystemSettings();
        }
      } else if (!this.online) {
        this.menuNotification = 'You are offline';
        this.wasOffline = true;
      }
    });
    this.getSystemSettings();
  }

  toggleSideBar(e: any): void {
    e.stopPropagation();
    this.showSidebar = !this.showSidebar;
  }

  getSystemSettings() {
    this.httpClient.systemInfo().subscribe(
      (settings: any) => {
        if (settings) {
          this.applicationTitle = settings['applicationTitle'];

          // get system current background style
          const colorName = settings.hasOwnProperty('currentStyle')
            ? settings['currentStyle'].split('/')[0]
            : settings.hasOwnProperty('keyStyle')
            ? settings['keyStyle'].split('/')[0]
            : 'blue';
          this.backgroundColor = MENU_BACKGROUND_COLORS[colorName];

          this.contextPath = settings.contextPath
            ? settings.contextPath + '/'
            : '';
        }
        this.menuLoading = false;
        this.menuLoadingFail = false;
      },
      () => {
        this.menuLoading = false;
        this.menuLoadingFail = true;
      }
    );
  }
}
