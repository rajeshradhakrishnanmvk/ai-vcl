import { Injectable, signal } from '@angular/core';

export interface DialogConfig {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface DialogRef {
  id: string;
  config: DialogConfig;
  resolve: (result: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private counter = 0;
  readonly activeDialogs = signal<DialogRef[]>([]);

  confirm(config: DialogConfig): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const id = `dialog-${++this.counter}`;
      const ref: DialogRef = {
        id,
        config: {
          confirmLabel: 'Confirm',
          cancelLabel: 'Cancel',
          ...config
        },
        resolve: (result: boolean) => {
          this.activeDialogs.update(d => d.filter(x => x.id !== id));
          resolve(result);
        }
      };
      this.activeDialogs.update(d => [...d, ref]);
    });
  }

  alert(message: string, title?: string): Promise<void> {
    return this.confirm({ message, title, cancelLabel: '', confirmLabel: 'OK' }).then(() => undefined);
  }

  close(id: string, result: boolean): void {
    const ref = this.activeDialogs().find(d => d.id === id);
    ref?.resolve(result);
  }
}
