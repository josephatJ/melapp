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
    path: 'job-card',
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
      import(
        './pages/submitted-timesheets/submitted-timesheets.component'
      ).then((m) => m.SubmittedTimesheetsComponent),
  },
  {
    path: 'my-complains',
    loadComponent: () =>
      import('./pages/complains/complains.component').then(
        (m) => m.ComplainsComponent
      ),
  },
  {
    path: 'submitted-complains',
    loadComponent: () =>
      import('./pages/submitted-complains/submitted-complains.component').then(
        (m) => m.SubmittedComplainsComponent
      ),
  },
  {
    path: 'transfer-requests',
    loadComponent: () =>
      import('./pages/transfer-requests/transfer-requests.component').then(
        (m) => m.TransferRequestsComponent
      ),
  },
  {
    path: 'messages-and-feedback',
    loadComponent: () =>
      import(
        './pages/messages-and-feedback/messages-and-feedback.component'
      ).then((m) => m.MessagesAndFeedbackComponent),
  },
  {
    path: 'staff-payroll-list',
    loadComponent: () =>
      import('./pages/staff-list-payroll/staff-list-payroll.component').then(
        (m) => m.StaffListPayrollComponent
      ),
  },
  {
    path: 'payroll',
    loadComponent: () =>
      import('./pages/payroll-processing/payroll-processing.component').then(
        (m) => m.PayrollProcessingComponent
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
      import('./pages/pis-settings/pis-settings.component').then(
        (m) => m.PisSettingsComponent
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
