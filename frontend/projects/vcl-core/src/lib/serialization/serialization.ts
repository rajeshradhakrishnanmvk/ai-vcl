import { ComponentNode } from '../models/component-node.model';

export interface SerializedDocument {
  version: string;
  root: ComponentNode;
}

export function serializeDocument(root: ComponentNode, version = '1.0'): SerializedDocument {
  return { version, root: deepClone(root) };
}

export function deserializeDocument(doc: unknown): SerializedDocument {
  const typed = doc as SerializedDocument;
  if (!typed?.version || !typed?.root) {
    throw new Error('Invalid serialized document: missing version or root.');
  }
  return typed;
}

export function toJson(doc: SerializedDocument): string {
  return JSON.stringify(doc, null, 2);
}

export function fromJson(json: string): SerializedDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${(e as Error).message}`);
  }
  return deserializeDocument(parsed);
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
