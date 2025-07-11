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
    path: 'activity-requests',
    loadComponent: () =>
      import('./pages/activity-request/activity-request.component').then(
        (m) => m.ActivityRequestComponent
      ),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.component').then(
        (m) => m.ProjectsComponent
      ),
  },
  {
    path: 'sbps',
    loadComponent: () =>
      import('./pages/sbps-tracker/sbps-tracker.component').then(
        (m) => m.SbpsTrackerComponent
      ),
  },
  {
    path: 'activities',
    loadComponent: () =>
      import('./pages/attended-activities/attended-activities.component').then(
        (m) => m.AttendedActivitiesComponent
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
    path: 'calendar',
    loadComponent: () =>
      import('./pages/calendar/calendar.component').then(
        (m) => m.CalendarComponent
      ),
  },
  {
    path: 'configurations',
    loadComponent: () =>
      import('./pages/configurations/configurations.component').then(
        (m) => m.ConfigurationsComponent
      ),
  },
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./pages/project-management/project-management.component').then(
        (m) => m.ProjectManagementComponent
      ),
  },
];
