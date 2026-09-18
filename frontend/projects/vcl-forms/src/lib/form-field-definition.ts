import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

export interface FormFieldDefinition<T = unknown> {
  key: string;
  label: string;
  controlType: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
  defaultValue?: T;
  placeholder?: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  visibleWhen?: (value: unknown) => boolean;
  disabledWhen?: (value: unknown) => boolean;
  options?: Array<{ label: string; value: unknown }>;
}

export interface FormSectionDefinition {
  key: string;
  label?: string;
  fields: FormFieldDefinition[];
  collapsible?: boolean;
}
