export interface CustomField {
  id: string;
  label: string;
  options?: CustomFieldOption[];
  cols?: number;
  rows?: number;
  disabled?: any;
  value?: any;
  type?: string;
  placeholder?: string;
  required?: any;
  showClear?: boolean;
  minDate?: Date;
  maxDate?: Date;
  mask?: string;
  min?: number;
  max?: number;
}

export interface CustomFieldOption {
  id: string;
  name: string;
  code: any;
  label?: string;
  value?: string;
}
