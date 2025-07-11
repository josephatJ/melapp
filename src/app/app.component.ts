import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { primengModules } from './shared/primeng.modules';
import { Drawer } from 'primeng/drawer';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDhis2MenuModule } from './shared/modules/ngx-dhis2-menu/ngx-dhis2-menu.module';
import { SharedCurrentUserStateService } from './shared/resources/services/current-user.service';
import { NgxDhis2HttpClientService } from './shared/modules/ngx-http-client/services/http-client.service';
import { UserInterface } from './shared/models/user.models';
import { SharedMessageSummaryStateService } from './shared/resources/services/message-summary.state.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...primengModules,
    NgxDhis2MenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'MEL';
  menuItems = computed<MenuItem[]>(() => [
    {
      separator: false,
    },
    {
      label: '',
      items: [
        {
          label: 'Home',
          icon: 'pi pi-home',
          shortcut: '',
          routerLink: 'home',
        },
        {
          label: 'Dashboard',
          icon: 'pi pi-objects-column',
          shortcut: '',
          routerLink: 'dashboard',
        },
        {
          label: 'Activity Requests',
          icon: 'pi pi-file-o',
          shortcut: '',
          routerLink: 'activity-requests',
        },
        {
          label: 'Projects',
          icon: 'pi pi-ticket',
          shortcut: '',
          routerLink: 'projects',
        },
        {
          label: 'SBP Tracker',
          icon: 'pi pi-microsoft',
          shortcut: '',
          routerLink: 'sbps',
        },
      ],
    },
    {
      label: 'Others',
      items: [
        {
          label: 'Activities',
          icon: 'pi pi-table',
          routerLink: 'activities',
        },
        {
          label: 'Calendar',
          icon: 'pi pi-calendar',
          shortcut: '',
          routerLink: 'calendar',
        },
        {
          label: 'Messages',
          icon: 'pi pi-inbox',
          badge:
            this.unreadInformation()?.unreadMessageConversations.toString(),
          routerLink: 'messages-and-feedback',
        },
        {
          label: 'Configurations',
          icon: 'pi pi-cog',
          badge: '',
          routerLink: 'configurations',
        },
      ],
    },
    {
      separator: false,
    },
  ]);
  currentMenuId = signal<string>('home');

  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
  }

  visible: boolean = true;
  currentUserState = inject(SharedCurrentUserStateService);
  private unreadInformationState = inject(SharedMessageSummaryStateService);
  private httpClientService = inject(NgxDhis2HttpClientService);

  unreadInformation = this.unreadInformationState.unreadInformation;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const routePath = location.hash.substring(1);
    this.currentMenuId.set(routePath.split('/')[1]);

    this.httpClientService.get('me').subscribe({
      next: (user) => {
        const updatedUser: UserInterface = {
          ...user,
          keyedAuthorities: this.createKeyValuePair(user?.authorities),
        };
        this.currentUserState.updateCurrentUser(updatedUser);
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
      },
    });

    this.httpClientService.get('me/dashboard').subscribe({
      next: (unreadInformation) => {
        this.unreadInformationState.updateMessagesData(unreadInformation);
      },
      error: (err) => {
        console.error('Failed to fetch unread messages:', err);
      },
    });
  }

  createKeyValuePair(items: string[]): {
    [key: string]: string;
  } {
    let keyValuePairedData: any = {};
    items?.forEach((item: string) => {
      if (item) {
        keyValuePairedData[item] = item;
      }
    });
    return keyValuePairedData;
  }

  onChangeRoute(event: Event, path: string): void {
    event.stopPropagation();
    this.currentMenuId.set(path);
    this.router.navigate([path]);
  }
}
