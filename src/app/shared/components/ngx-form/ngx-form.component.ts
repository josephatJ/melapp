import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CustomField } from '../../models/default-field.model';
import { CommonModule } from '@angular/common';
import { primengModules } from '../../primeng.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { determinFormValidity } from '../../resources/helpers/determine-form-vality.helper';
import { NgxSelectUserComponent } from '../ngx-select-user/ngx-select-user.component';

@Component({
  selector: 'ngx-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...primengModules,
    NgxSelectUserComponent,
  ],
  templateUrl: './ngx-form.component.html',
  styleUrl: './ngx-form.component.scss',
})
export class NgxFormComponent implements OnChanges {
  @Input() formFields!: CustomField[];
  @Input() responsivenessClass: string = 'col-md-4';
  formValues: any = {};
  @Output() formData: EventEmitter<any> = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes as any)?.formFields?.currentValue?.length > 0) {
      (changes as any)?.formFields?.currentValue?.forEach(
        (currentFormField: any) => {
          this.formValues[currentFormField?.id] = {
            value:
              currentFormField?.type !== 'PHONE_NUMBER'
                ? currentFormField?.value
                : currentFormField?.value?.split('-')?.join(''),
            key: currentFormField?.id,
            field: currentFormField,
          };
        }
      );
      this.formData.emit({
        data: this.formValues,
        isFormValid: determinFormValidity(this.formValues, this.formFields),
      });
    }
  }

  getDataValue(value: any, fieldDefinition: CustomField): void {
    this.formValues[fieldDefinition?.id] = {
      value:
        fieldDefinition?.type !== 'PHONE_NUMBER'
          ? value
          : value.split('-').join(''),
      key: fieldDefinition?.id,
      field: fieldDefinition,
    };
    this.formData.emit({
      data: this.formValues,
      isFormValid: determinFormValidity(this.formValues, this.formFields),
    });
  }

  onGetUserDetails(userDetails: any): void {}
}
