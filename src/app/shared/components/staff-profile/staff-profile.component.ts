import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SharedCurrentUserStateService } from '../../resources/services/current-user.service';
import { primengModules } from '../../primeng.modules';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule, ...primengModules],
  templateUrl: './staff-profile.component.html',
  styleUrl: './staff-profile.component.scss',
})
export class StaffProfileComponent implements OnInit {
  private userState = inject(SharedCurrentUserStateService);
  private router = inject(Router);

  currentUser = this.userState.currentUser;

  ngOnInit(): void {
    console.log(this.currentUser());
    // Load user profile from tracker data
  }

  onEdit(event: Event, id: string): void {
    event.stopPropagation();
    this.router.navigate(['staff/' + id]);
  }
}
