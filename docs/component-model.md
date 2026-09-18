# Component Model

## ComponentNode

Every UI element in the VCL tree is represented as a `ComponentNode`:

```typescript
interface ComponentNode {
  id: string;                          // Stable unique identifier
  type: string;                        // Registered component type key
  name?: string;                       // Optional human-readable name
  properties: Record<string, unknown>; // Property bag
  children: ComponentNode[];           // Child nodes
  metadata?: ComponentMetadata;        // Design-time hints
}
```

## ComponentRegistry

The registry is a singleton Angular service that maps type strings to definitions:

```typescript
const registry = inject(ComponentRegistry);

// Register a definition
registry.register({
  type: 'vcl-button',
  metadata: { displayName: 'Button', category: 'Basic' },
  create: () => ({ id: uuid(), type: 'vcl-button', properties: {}, children: [] }),
  validate: node => [],
});

// Create a node
const node = registry.create('vcl-button');

// Serialize the entire tree
const json = toJson(serializeDocument(node));

// Deserialize
const doc = fromJson(json);
```

## Serialization Format

```json
{
  "version": "1.0",
  "root": {
    "id": "page-1",
    "type": "vcl-panel",
    "properties": { "title": "Customer" },
    "children": [
      {
        "id": "btn-save",
        "type": "vcl-button",
        "properties": { "variant": "primary" },
        "children": []
      }
    ]
  }
}
```

Unknown properties produce console warnings rather than silently corrupting the document.

## Validation

Each `ComponentDefinition` provides a `validate` function returning `ValidationResult[]`.
The registry aggregates results for the whole tree during design-time inspection.
