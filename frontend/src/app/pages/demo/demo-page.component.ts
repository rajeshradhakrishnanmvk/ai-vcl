import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VclButtonComponent } from 'vcl-components';
import { VclTextInputComponent } from 'vcl-components';
import { VclPanelComponent } from 'vcl-components';
import { VclStackComponent } from 'vcl-layout';
import { VclGridComponent } from 'vcl-layout';
import { VclDataGridComponent, CustomerDataSource, GridColumn } from 'vcl-data';
import { VclToastContainerComponent, ToastService } from 'vcl-dialogs';
import { ThemeService } from 'vcl-theming';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    VclButtonComponent,
    VclTextInputComponent,
    VclPanelComponent,
    VclStackComponent,
    VclGridComponent,
    VclDataGridComponent,
    VclToastContainerComponent
  ],
  template: `
    <div class="demo-app">
      <header class="demo-header">
        <h1 class="demo-header__title">AI-VCL Component Platform</h1>
        <div class="demo-header__actions">
          <vcl-button variant="ghost" (clicked)="toggleTheme()">
            {{ themeService.isDark ? '☀️ Light' : '🌙 Dark' }}
          </vcl-button>
        </div>
      </header>

      <main class="demo-main">
        <vcl-stack direction="column" gap="var(--vcl-space-8)">

          <!-- Buttons Demo -->
          <vcl-panel title="Buttons" [elevated]="true">
            <vcl-stack direction="row" gap="var(--vcl-space-3)" [wrap]="true">
              <vcl-button variant="primary" (clicked)="toastService.success('Primary clicked!')">
                Primary
              </vcl-button>
              <vcl-button variant="secondary" (clicked)="toastService.show('Secondary clicked!', 'info')">
                Secondary
              </vcl-button>
              <vcl-button variant="danger" (clicked)="toastService.error('Danger clicked!')">
                Danger
              </vcl-button>
              <vcl-button variant="ghost" (clicked)="toastService.warning('Ghost clicked!')">
                Ghost
              </vcl-button>
              <vcl-button [disabled]="true">Disabled</vcl-button>
              <vcl-button [busy]="true">Loading…</vcl-button>
            </vcl-stack>
          </vcl-panel>

          <!-- Form Demo -->
          <vcl-panel title="Customer Form" [elevated]="true">
            <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
              <vcl-grid columns="repeat(auto-fill, minmax(280px, 1fr))" gap="var(--vcl-space-4)">
                <vcl-text-input
                  label="Full Name"
                  [required]="true"
                  placeholder="Enter full name"
                  [hasError]="nameControl.invalid && nameControl.touched"
                  [errorMessage]="getError('name')"
                  formControlName="name">
                </vcl-text-input>
                <vcl-text-input
                  label="Email"
                  type="email"
                  [required]="true"
                  placeholder="Enter email address"
                  [hasError]="emailControl.invalid && emailControl.touched"
                  [errorMessage]="getError('email')"
                  formControlName="email">
                </vcl-text-input>
                <vcl-text-input
                  label="Phone"
                  type="tel"
                  placeholder="Enter phone number"
                  formControlName="phone">
                </vcl-text-input>
              </vcl-grid>
              <vcl-stack direction="row" gap="var(--vcl-space-3)" justify="end" style="margin-top: var(--vcl-space-4)">
                <vcl-button variant="secondary" type="button" (clicked)="customerForm.reset()">
                  Reset
                </vcl-button>
                <vcl-button variant="primary" type="submit" [busy]="submitting()">
                  Save Customer
                </vcl-button>
              </vcl-stack>
            </form>
          </vcl-panel>

          <!-- Data Grid Demo -->
          <vcl-panel title="Customer Data Grid" [elevated]="true">
            <vcl-data-grid
              [dataSource]="customerDataSource"
              [columns]="customerColumns">
            </vcl-data-grid>
          </vcl-panel>

        </vcl-stack>
      </main>

      <vcl-toast-container></vcl-toast-container>
    </div>
  `,
  styleUrl: './demo-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPageComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly themeService = inject(ThemeService);
  protected readonly customerDataSource = inject(CustomerDataSource);
  private readonly fb = inject(FormBuilder);

  protected readonly submitting = signal(false);

  protected readonly customerColumns: GridColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'createdAt', label: 'Created' }
  ];

  protected readonly customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['']
  });

  get nameControl() { return this.customerForm.controls.name; }
  get emailControl() { return this.customerForm.controls.email; }

  toggleTheme(): void {
    this.themeService.setTheme(this.themeService.isDark ? 'light' : 'dark');
  }

  getError(field: string): string | null {
    const ctrl = this.customerForm.get(field);
    if (!ctrl?.errors || !ctrl.touched) return null;
    if (ctrl.errors['required']) return 'This field is required.';
    if (ctrl.errors['email']) return 'Please enter a valid email address.';
    if (ctrl.errors['minlength']) return 'Must be at least 2 characters.';
    return 'Invalid value.';
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.toastService.error('Please fix validation errors before submitting.');
      return;
    }
    this.submitting.set(true);
    // Simulate API call
    setTimeout(() => {
      this.submitting.set(false);
      this.toastService.success('Customer saved successfully!');
      this.customerForm.reset();
    }, 1500);
  }
}
