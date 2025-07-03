import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';
import { primengModules } from '../../shared/primeng.modules';
// import { primengModules } from '../../shared/primeng.modules';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ...primengModules],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private userState = inject(SharedCurrentUserStateService);

  currentUser = this.userState.currentUser;
}
