import { Injectable } from '@angular/core';
import { ComponentNode, ValidationResult } from '../models/component-node.model';
import { ComponentDefinition } from './component-definition';

@Injectable({ providedIn: 'root' })
export class ComponentRegistry {
  private readonly definitions = new Map<string, ComponentDefinition>();

  register(definition: ComponentDefinition): void {
    if (this.definitions.has(definition.type)) {
      console.warn(`[ComponentRegistry] Overwriting existing registration for type: ${definition.type}`);
    }
    this.definitions.set(definition.type, definition);
  }

  unregister(type: string): void {
    this.definitions.delete(type);
  }

  getDefinition(type: string): ComponentDefinition | undefined {
    return this.definitions.get(type);
  }

  getAll(): ComponentDefinition[] {
    return Array.from(this.definitions.values());
  }

  create(type: string): ComponentNode {
    const def = this.definitions.get(type);
    if (!def) {
      throw new Error(`[ComponentRegistry] Unknown component type: ${type}`);
    }
    return def.create();
  }

  validate(node: ComponentNode): ValidationResult[] {
    const def = this.definitions.get(node.type);
    if (!def) {
      return [{ property: 'type', message: `Unknown type: ${node.type}`, severity: 'error' }];
    }
    return def.validate(node);
  }

  serialize(node: ComponentNode): unknown {
    const def = this.definitions.get(node.type);
    return def?.serialize ? def.serialize(node) : node;
  }

  deserialize(value: unknown): ComponentNode {
    const obj = value as ComponentNode;
    const def = this.definitions.get(obj?.type);
    return def?.deserialize ? def.deserialize(value) : obj;
  }

  hasType(type: string): boolean {
    return this.definitions.has(type);
  }
}
