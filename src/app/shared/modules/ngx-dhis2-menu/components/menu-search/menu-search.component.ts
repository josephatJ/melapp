import { Component, OnInit, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu-search',
  standalone: false,
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.css'],
  animations: [
    trigger('slide', [
      state(
        'in',
        style({
          opacity: 1,
        })
      ),
      transition('void => *', [
        style({
          transform: 'translateY(-100%)',
        }),
        animate(300),
      ]),
      transition('* => void', [
        animate(300),
        style({
          transform: 'translateY(-100%)',
        }),
      ]),
    ]),
  ],
})
export class MenuSearchComponent implements OnInit {
  @Input() rootUrl: string;
  searchWidth: number;
  showApps: boolean;
  apps: any[];
  originalApps: any[];
  loadingModules: boolean;
  filteredApp: string;
  constructor(private menuService: MenuService) {
    this.rootUrl = '../../../';
    this.searchWidth = 47;
    this.showApps = false;
    this.apps = [];
    this.originalApps = [];
    this.loadingModules = true;
    this.filteredApp = '';
  }

  ngOnInit() {
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

  updateMenuModules() {
    this.apps = this._prepareMenuModules();
  }

  widdenSearch(e?: Event): void {
    if (e) {
      e.stopPropagation();
    }
    document.getElementById('menu_search_input')!.focus();
    this.showApps = true;
  }

  reduceSearch(e?: Event): void {
    if (e) {
      e.stopPropagation();
    }
    document.getElementById('menu_search_input')!.blur();
    this.showApps = false;
  }

  toggleSearch(e: Event): void {
    e.stopPropagation();
    if (this.showApps) {
      this.reduceSearch();
    } else {
      this.widdenSearch();
    }
  }
}
