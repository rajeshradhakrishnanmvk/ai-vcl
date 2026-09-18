import { ComponentMetadata, ComponentNode, ValidationResult } from '../models/component-node.model';

export interface ComponentDefinition {
  type: string;
  metadata: ComponentMetadata;
  create(): ComponentNode;
  validate(node: ComponentNode): ValidationResult[];
  serialize?(node: ComponentNode): unknown;
  deserialize?(value: unknown): ComponentNode;
}
