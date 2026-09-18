import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'vcl-toast-container',
  standalone: true,
  template: `
    <div class="vcl-toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="vcl-toast vcl-toast--{{ toast.severity }}" role="alert">
          <span class="vcl-toast__message">{{ toast.message }}</span>
          <button
            type="button"
            class="vcl-toast__close"
            [attr.aria-label]="'Dismiss ' + toast.severity + ' notification'"
            (click)="toastService.dismiss(toast.id)">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VclToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
