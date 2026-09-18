import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  input,
  output,
  viewChild
} from '@angular/core';

@Component({
  selector: 'vcl-dialog',
  standalone: true,
  template: `
    <dialog
      #dialogEl
      class="vcl-dialog"
      [attr.aria-labelledby]="titleId"
      (close)="handleClose()"
      (click)="handleBackdropClick($event)">
      <div class="vcl-dialog__container" (click)="$event.stopPropagation()">
        @if (title()) {
          <header class="vcl-dialog__header">
            <h2 [id]="titleId" class="vcl-dialog__title">{{ title() }}</h2>
            <button
              class="vcl-dialog__close"
              type="button"
              aria-label="Close dialog"
              (click)="close()">
              &times;
            </button>
          </header>
        }
        <div class="vcl-dialog__body">
          <ng-content />
        </div>
        <ng-content select="[vcl-dialog-footer]" />
      </div>
    </dialog>
  `,
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VclDialogComponent implements OnInit, OnDestroy {
  private static counter = 0;
  readonly titleId = `vcl-dialog-title-${++VclDialogComponent.counter}`;

  readonly title = input<string | null>(null);
  readonly modal = input(true);
  readonly closed = output<void>();

  private dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  ngOnInit(): void {
    if (this.modal()) {
      this.dialogEl().nativeElement.showModal();
    } else {
      this.dialogEl().nativeElement.show();
    }
  }

  ngOnDestroy(): void {
    const el = this.dialogEl().nativeElement;
    if (el.open) el.close();
  }

  close(): void {
    this.dialogEl().nativeElement.close();
  }

  handleClose(): void {
    this.closed.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    const dialog = this.dialogEl().nativeElement;
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (clickedOutside) this.close();
  }
}
