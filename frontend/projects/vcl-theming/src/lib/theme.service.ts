import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<ThemeMode>('system');
  readonly theme = this._theme.asReadonly();

  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.mediaQuery.addEventListener('change', () => this.applyTheme());
    const saved = localStorage.getItem('vcl-theme') as ThemeMode | null;
    if (saved) {
      this.setTheme(saved);
    } else {
      this.applyTheme();
    }
  }

  setTheme(mode: ThemeMode): void {
    this._theme.set(mode);
    localStorage.setItem('vcl-theme', mode);
    this.applyTheme();
  }

  private applyTheme(): void {
    const mode = this._theme();
    const isDark = mode === 'dark' || (mode === 'system' && this.mediaQuery.matches);
    document.documentElement.setAttribute(
      'data-vcl-theme',
      isDark ? 'dark' : 'light'
    );
  }

  get isDark(): boolean {
    const mode = this._theme();
    return mode === 'dark' || (mode === 'system' && this.mediaQuery.matches);
  }
}
