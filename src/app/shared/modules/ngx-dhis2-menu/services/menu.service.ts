import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import * as fromConstants from '../constants';
import { NgxDhis2HttpClientService } from '../../ngx-http-client/services/http-client.service';

@Injectable()
export class MenuService {
  private _menuModules$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  constructor(private httpClient: NgxDhis2HttpClientService) {}

  getMenuModules(rootUrl: string): Observable<any> {
    return Observable.create((observer: any) => {
      this.httpClient
        .get('dhis-web-commons/menu/getModules.action', { useRootUrl: true })
        .subscribe(
          (menuModuleResult: any) => {
            //console.log("default menu", menuModuleResult.modules);
            const sanitizedMenu = this._sanitizeMenuItems(
              menuModuleResult.modules,
              rootUrl
            );

            //console.log("sanitized menu", sanitizedMenu);
            this._menuModules$.next(sanitizedMenu);
            observer.next(sanitizedMenu);
            observer.complete();
          },
          () => {
            observer.next(null);
            observer.complete();
          }
        );
    });
  }

  getSanitizedMenus() {
    return this._menuModules$.asObservable();
  }

  private _sanitizeMenuItems(menuItems: any[], rootUrl: string): any {
    //console.log("menu items", menuItems);

    const sanitizedMenuItems =
      menuItems?.map((item: any) => {
        const newItem: any = { ...item };
        if (
          !newItem.hasOwnProperty('displayName') ||
          newItem.displayName === ''
        ) {
          newItem.displayName = newItem?.name;
        }

        // if (newItem.defaultAction.indexOf("http") === -1) {
        //   newItem.defaultAction = "../../" + newItem.defaultAction;
        // }

        // if (newItem.icon.indexOf("http") === -1) {
        //   newItem.icon = "../../" + newItem.icon;
        // }

        if (newItem.defaultAction.startsWith('../')) {
          newItem.defaultAction = '../../' + newItem.defaultAction;
        }
        if (newItem.icon.startsWith('../')) {
          newItem.icon = '../../' + newItem.icon;
        }

        newItem.onlyShowOnSearch = false;

        return newItem;
      }) || [];

    const predefinedMenuItems = fromConstants.PREDEFINED_MENU_ITEMS.map(
      (item: any) => {
        const newItem: any = { ...item };

        if (newItem.defaultAction && newItem.defaultAction.startsWith('/')) {
          newItem.defaultAction = '../../..' + newItem.defaultAction;
        } else {
          newItem.defaultAction = rootUrl + newItem.defaultAction;
        }

        if (newItem.icon && newItem.icon.startsWith('/')) {
          newItem.icon = '../../..' + newItem.icon;
        } else {
          newItem.icon = rootUrl + newItem.icon;
        }
        return newItem;
      }
    );

    //console.log("predefined menu items", predefinedMenuItems);

    //console.log(predefinedMenuItems);
    return [...sanitizedMenuItems, ...predefinedMenuItems];
  }
}
