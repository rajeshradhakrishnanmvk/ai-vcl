import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, timeout } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export interface NativeMessage<T = unknown> {
  id: string;
  type: string;
  version: string;
  payload: T;
}

declare global {
  interface Window {
    chrome?: {
      webview?: {
        postMessage(message: string): void;
        addEventListener(event: 'message', handler: (e: MessageEvent) => void): void;
        removeEventListener(event: 'message', handler: (e: MessageEvent) => void): void;
      };
    };
  }
}

@Injectable({ providedIn: 'root' })
export class NativeBridgeService {
  private readonly inbound$ = new Subject<NativeMessage>();
  private messageCounter = 0;

  constructor() {
    if (this.isWebView2Available()) {
      window.chrome!.webview!.addEventListener('message', (e: MessageEvent) => {
        try {
          const msg = JSON.parse(e.data as string) as NativeMessage;
          this.inbound$.next(msg);
        } catch {
          console.warn('[NativeBridgeService] Failed to parse inbound message', e.data);
        }
      });
    }
  }

  send<TPayload, TResponse = unknown>(
    type: string,
    payload: TPayload,
    version = '1.0'
  ): Observable<TResponse> {
    if (!this.isWebView2Available()) {
      return throwError(() => new Error('WebView2 bridge is not available.'));
    }

    const id = `msg-${++this.messageCounter}-${Date.now()}`;
    const message: NativeMessage<TPayload> = { id, type, version, payload };

    window.chrome!.webview!.postMessage(JSON.stringify(message));

    return this.inbound$.pipe(
      filter(m => m.id === id),
      take(1),
      map(m => m.payload as TResponse),
      timeout(10_000)
    );
  }

  isWebView2Available(): boolean {
    return !!(window.chrome?.webview);
  }

  get messages$(): Observable<NativeMessage> {
    return this.inbound$.asObservable();
  }
}
