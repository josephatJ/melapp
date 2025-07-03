import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private userState = inject(SharedCurrentUserStateService);

  currentUser = this.userState.currentUser;
}
