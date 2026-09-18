import { Injectable } from '@angular/core';
import { ActionDefinition, ActionGroup } from '../action-definition';

@Injectable({ providedIn: 'root' })
export class ActionService {
  private readonly actions = new Map<string, ActionDefinition>();
  private readonly groups = new Map<string, ActionGroup>();
  private readonly shortcutMap = new Map<string, string>();

  register(action: ActionDefinition): void {
    this.actions.set(action.id, action);
    if (action.shortcut) {
      this.shortcutMap.set(action.shortcut.toLowerCase(), action.id);
    }
  }

  registerGroup(group: ActionGroup): void {
    this.groups.set(group.id, group);
    for (const action of group.actions) {
      this.register(action);
    }
  }

  unregister(id: string): void {
    const action = this.actions.get(id);
    if (action?.shortcut) {
      this.shortcutMap.delete(action.shortcut.toLowerCase());
    }
    this.actions.delete(id);
  }

  getAction(id: string): ActionDefinition | undefined {
    return this.actions.get(id);
  }

  getGroup(id: string): ActionGroup | undefined {
    return this.groups.get(id);
  }

  getAllActions(): ActionDefinition[] {
    return Array.from(this.actions.values());
  }

  async execute(id: string, context?: unknown): Promise<boolean> {
    const action = this.actions.get(id);
    if (!action) {
      console.warn(`[ActionService] Action not found: ${id}`);
      return false;
    }
    if (action.enabled && !action.enabled()) return false;
    if (action.canExecute && !action.canExecute(context)) return false;

    try {
      await Promise.resolve(action.execute(context));
      return true;
    } catch (err) {
      console.error(`[ActionService] Error executing action ${id}:`, err);
      return false;
    }
  }

  handleKeyboardShortcut(event: KeyboardEvent): boolean {
    const combo = this.buildShortcutKey(event);
    const id = this.shortcutMap.get(combo);
    if (id) {
      event.preventDefault();
      void this.execute(id);
      return true;
    }
    return false;
  }

  private buildShortcutKey(event: KeyboardEvent): string {
    const parts: string[] = [];
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    parts.push(event.key.toLowerCase());
    return parts.join('+');
  }
}
