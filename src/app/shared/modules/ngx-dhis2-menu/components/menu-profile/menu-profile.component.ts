import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { PROFILE_MENUS } from '../../constants/profile-menus';
import { NgxDhis2HttpClientService } from '../../../ngx-http-client/services/http-client.service';

@Component({
  selector: 'app-menu-profile',
  standalone: false,
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.css'],
})
export class MenuProfileComponent implements OnInit {
  @Input()
  rootUrl: string;

  @Input()
  contextPath: string;

  @Input()
  backgroundColor!: string;

  showProfile: boolean;
  currentUser$!: Observable<any>;
  loadingUser!: boolean;
  profileMenus: any[];
  constructor(private httpClient: NgxDhis2HttpClientService) {
    this.showProfile = false;
    this.rootUrl = this.contextPath = '../../../';
    this.profileMenus = PROFILE_MENUS;
    _.map(this.profileMenus, (menuItem: any, index: number) => {
      if (
        menuItem.defaultAction &&
        menuItem.defaultAction.indexOf('../') == -1 &&
        menuItem.defaultAction.indexOf('/') == 0
      ) {
        this.profileMenus[index].defaultAction =
          '../../..' + menuItem.defaultAction;
      }
    });
  }

  ngOnInit() {
    this.currentUser$ = this.httpClient.me();
  }

  showMenuProfile(e: Event): void {
    e.stopPropagation();
    this.showProfile = true;
  }

  hideMenuProfile(e?: Event): void {
    if (e) {
      e.stopPropagation();
    }

    this.showProfile = false;
  }
}
