import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

@Component({
  selector: 'vcl-button',
  standalone: true,
  template: `
    <button
      class="vcl-button vcl-button--{{ variant() }}"
      type="button"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-busy]="busy() ? 'true' : null"
      (click)="handleClick($event)">
      @if (busy()) {
        <span class="vcl-button__spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VclButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input(false);
  readonly busy = input(false);
  readonly ariaLabel = input<string | null>(null);
  readonly clicked = output<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.busy()) {
      this.clicked.emit(event);
    }
  }
}
