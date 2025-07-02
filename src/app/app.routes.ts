import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'staff',
    loadComponent: () =>
      import('./pages/staff-list/staff-list.component').then(
        (m) => m.StaffListComponent
      ),
  },
  {
    path: 'staff/:id',
    loadComponent: () =>
      import('./pages/staff-management/staff-management.component').then(
        (m) => m.StaffManagementComponent
      ),
  },
  {
    path: 'timesheets',
    loadComponent: () =>
      import('./pages/timesheet/timesheet.component').then(
        (m) => m.TimesheetComponent
      ),
  },
  {
    path: 'pis',
    loadComponent: () =>
      import('./pages/pis/pis.component').then((m) => m.PisComponent),
  },
  {
    path: 'submitted-timesheets',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'complains',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'submitted-complains',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'tranfer-requests',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./pages/calendar/calendar.component').then(
        (m) => m.CalendarComponent
      ),
  },
  {
    path: 'settings-pis',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'configurations',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
];
