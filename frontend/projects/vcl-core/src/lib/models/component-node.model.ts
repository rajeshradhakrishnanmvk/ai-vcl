export interface ComponentNode {
  id: string;
  type: string;
  name?: string;
  properties: Record<string, unknown>;
  children: ComponentNode[];
  metadata?: ComponentMetadata;
}

export interface ComponentMetadata {
  category?: string;
  displayName?: string;
  description?: string;
  icon?: string;
  allowedParents?: string[];
  designOnly?: boolean;
  version?: string;
}

export interface ComponentEvent {
  componentId: string;
  eventName: string;
  payload?: unknown;
}

export interface ValidationResult {
  property: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface LayoutProperties {
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'none';
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  margin?: string;
  padding?: string;
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  gridColumns?: string;
  order?: number;
}
