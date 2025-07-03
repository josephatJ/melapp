import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CustomField } from '../../shared/models/default-field.model';
import { UserInterface } from '../../shared/models/user.models';
import { CommonModule } from '@angular/common';
import { NgxFormComponent } from '../../shared/components/ngx-form/ngx-form.component';

@Component({
  selector: 'app-staff-management-form',
  imports: [CommonModule, NgxFormComponent],
  templateUrl: './staff-management-form.component.html',
  styleUrl: './staff-management-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffManagementFormComponent implements OnInit {
  formFields!: CustomField[];
  @Input() userProfile!: any;

  ngOnInit(): void {
    this.createFormFields(this.userProfile);
  }

  createFormFields(userProfile: any): void {
    console.log('CREATE', userProfile);
    this.formFields = [
      {
        id: 'firstname',
        label: 'First Name',
        value: userProfile?.firstName,
      },
      {
        id: 'middlename',
        label: 'Middle Name',
      },
      {
        id: 'lastname',
        label: 'Last Name',
        value: userProfile?.surname,
      },
    ];
  }
}
