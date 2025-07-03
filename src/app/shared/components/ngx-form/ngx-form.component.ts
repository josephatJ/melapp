import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomField } from '../../models/default-field.model';
import { CommonModule } from '@angular/common';
import { primengModules } from '../../primeng.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { determinFormValidity } from '../../resources/helpers/determine-form-vality.helper';

@Component({
  selector: 'ngx-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...primengModules],
  templateUrl: './ngx-form.component.html',
  styleUrl: './ngx-form.component.scss',
})
export class NgxFormComponent {
  @Input() formFields!: CustomField[];
  @Input() responsivenessClass: string = 'col-md-4';
  formValues: any = {};
  @Output() formData: EventEmitter<any> = new EventEmitter<any>();

  getDataValue(value: any, fieldDefinition: CustomField): void {
    this.formValues[fieldDefinition?.id] = {
      value: value,
      key: fieldDefinition?.id,
      field: fieldDefinition,
    };
    this.formData.emit({
      data: this.formValues,
      isFormValid: determinFormValidity(this.formValues, this.formFields),
    });
  }
}
