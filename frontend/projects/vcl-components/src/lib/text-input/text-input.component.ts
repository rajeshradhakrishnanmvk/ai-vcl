import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'vcl-text-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VclTextInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="vcl-text-input-wrapper">
      @if (label()) {
        <label
          class="vcl-text-input__label"
          [attr.for]="inputId()">
          {{ label() }}
          @if (required()) {
            <span class="vcl-text-input__required" aria-hidden="true"> *</span>
          }
        </label>
      }
      <input
        class="vcl-text-input__control"
        [id]="inputId()"
        [type]="type()"
        [value]="_value()"
        [placeholder]="placeholder() ?? ''"
        [disabled]="_disabled()"
        [readonly]="readonly()"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-describedby]="errorId() ?? null"
        [attr.aria-invalid]="hasError() ? 'true' : null"
        [attr.autocomplete]="autocomplete() ?? null"
        [attr.maxlength]="maxLength() ?? null"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      @if (hasError() && errorMessage()) {
        <span [id]="errorId()" class="vcl-text-input__error" role="alert">
          {{ errorMessage() }}
        </span>
      }
    </div>
  `,
  styleUrl: './text-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VclTextInputComponent implements ControlValueAccessor {
  private static counter = 0;

  readonly label = input<string | null>(null);
  readonly type = input<string>('text');
  readonly placeholder = input<string | null>(null);
  readonly required = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);
  readonly hasError = input(false);
  readonly autocomplete = input<string | null>(null);
  readonly maxLength = input<number | null>(null);
  readonly valueChange = output<string>();

  readonly inputId = input(`vcl-input-${++VclTextInputComponent.counter}`);
  readonly errorId = input<string | null>(null);

  readonly _value = signal('');
  readonly _disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  writeValue(value: string): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
