import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from 'vcl-theming';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: '<router-outlet />'
})
export class App {
  // Eagerly initialize theme service to apply theme on startup
  constructor(private readonly _themeService: ThemeService) {}
}
