import { Signal } from '@angular/core';

export interface ActionDefinition {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  enabled?: Signal<boolean>;
  visible?: Signal<boolean>;
  checked?: Signal<boolean>;
  execute: (context?: unknown) => void | Promise<void>;
  canExecute?: (context?: unknown) => boolean;
}

export interface ActionGroup {
  id: string;
  label: string;
  actions: ActionDefinition[];
}
