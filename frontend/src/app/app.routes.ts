import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/demo/demo-page.component').then(m => m.DemoPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
