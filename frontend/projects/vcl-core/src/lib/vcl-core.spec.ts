import { TestBed } from '@angular/core/testing';
import { ComponentRegistry } from './registry/component-registry';
import { ComponentNode } from './models/component-node.model';
import { serializeDocument, fromJson, toJson } from './serialization/serialization';

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    registry = TestBed.inject(ComponentRegistry);
  });

  it('should register and retrieve a component definition', () => {
    registry.register({
      type: 'vcl-button',
      metadata: { displayName: 'Button', category: 'Basic' },
      create: () => ({ id: '1', type: 'vcl-button', properties: {}, children: [] }),
      validate: () => []
    });

    const def = registry.getDefinition('vcl-button');
    expect(def).toBeTruthy();
    expect(def!.metadata.displayName).toBe('Button');
  });

  it('should create a node from a registered type', () => {
    registry.register({
      type: 'vcl-label',
      metadata: {},
      create: () => ({ id: 'lbl-1', type: 'vcl-label', properties: {}, children: [] }),
      validate: () => []
    });

    const node = registry.create('vcl-label');
    expect(node.type).toBe('vcl-label');
    expect(node.id).toBe('lbl-1');
  });

  it('should throw for unknown type', () => {
    expect(() => registry.create('unknown-type')).toThrow();
  });

  it('should return validation error for unregistered type', () => {
    const errors = registry.validate({ id: '1', type: 'no-such', properties: {}, children: [] });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].severity).toBe('error');
  });
});

describe('Serialization', () => {
  it('should round-trip a ComponentNode to JSON and back', () => {
    const node: ComponentNode = {
      id: 'page-1',
      type: 'vcl-panel',
      properties: { title: 'Test' },
      children: [
        { id: 'btn-1', type: 'vcl-button', properties: { variant: 'primary' }, children: [] }
      ]
    };

    const doc = serializeDocument(node);
    const json = toJson(doc);
    const restored = fromJson(json);

    expect(restored.root.id).toBe('page-1');
    expect(restored.root.children[0].type).toBe('vcl-button');
    expect(restored.version).toBe('1.0');
  });

  it('should throw on invalid JSON', () => {
    expect(() => fromJson('not valid json')).toThrow();
  });

  it('should throw on missing root', () => {
    expect(() => fromJson(JSON.stringify({ version: '1.0' }))).toThrow();
  });
});
