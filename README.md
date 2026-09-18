# AI-VCL: Angular/.NET Visual Component Library Platform

AI-VCL is a full-stack, reusable component library platform inspired by the Delphi VCL architecture, built with modern web and .NET technologies.

## Technology Stack

| Layer        | Technology                                                |
|--------------|-----------------------------------------------------------|
| Frontend     | Angular 20 (standalone), TypeScript strict, SCSS, Signals |
| Backend      | ASP.NET Core Web API, C#, EF Core, FluentValidation        |
| Desktop Host | .NET 8, WPF/WinUI 3, Microsoft WebView2                   |
| Testing      | Vitest (Angular), xUnit (.NET), Playwright (E2E)          |

## Repository Structure

```
ai-vcl/
├── docs/                        # Architecture and API documentation
├── frontend/                    # Angular workspace
│   ├── src/                     # Demo application
│   └── projects/
│       ├── vcl-core/            # Component model, registry, serialization, bridge
│       ├── vcl-components/      # Button, Label, TextInput, Panel
│       ├── vcl-forms/           # Form field definitions
│       ├── vcl-layout/          # StackLayout, GridLayout
│       ├── vcl-data/            # DataSource, DataGrid, API clients
│       ├── vcl-actions/         # ActionDefinition, ActionService
│       ├── vcl-dialogs/         # Dialog, Toast, DialogService, ToastService
│       └── vcl-theming/         # Token-based theme system, ThemeService
├── backend/                     # ASP.NET Core solution
│   ├── src/
│   │   ├── ComponentPlatform.Api/
│   │   ├── ComponentPlatform.Application/
│   │   ├── ComponentPlatform.Domain/
│   │   ├── ComponentPlatform.Infrastructure/
│   │   ├── ComponentPlatform.Contracts/
│   │   └── ComponentPlatform.DesktopBridge/
│   └── tests/
│       └── ComponentPlatform.UnitTests/
└── desktop/                     # WebView2 desktop host
    └── ComponentPlatform.WinUI/
```

## Quick Start

### Prerequisites

- Node.js 20+
- .NET 8 SDK
- Angular CLI (`npm install -g @angular/cli`)

### Frontend (Angular)

```bash
cd frontend
npm install
ng serve                      # Start demo app at http://localhost:4200
ng build                      # Production build
ng test vcl-components        # Run component unit tests
```

### Backend (ASP.NET Core)

```bash
cd backend
dotnet restore ComponentPlatform.sln
dotnet build ComponentPlatform.sln
dotnet run --project src/ComponentPlatform.Api   # API at https://localhost:7001
dotnet test ComponentPlatform.sln                # Run all unit tests
```

Swagger UI is available at `https://localhost:7001/swagger` in development mode.

### Desktop Host (Windows only)

```bash
cd desktop/ComponentPlatform.WinUI
dotnet run                    # Opens WebView2 window loading Angular app
```

## Component Libraries

### `vcl-core`
Core component model primitives:
- `ComponentNode` / `ComponentMetadata` — typed component tree nodes
- `ComponentRegistry` — register, create, validate, and serialize components
- `NativeBridgeService` — type-safe WebView2 message bridge
- Serialization utilities (`serializeDocument`, `fromJson`, `toJson`)

### `vcl-components`
UI building blocks:
- `VclButtonComponent` — primary, secondary, danger, ghost variants
- `VclLabelComponent` — accessible form labels with required indicator
- `VclTextInputComponent` — ControlValueAccessor-compatible text input
- `VclPanelComponent` — card/panel container with optional header

### `vcl-layout`
Layout primitives:
- `VclStackComponent` — flexbox row/column layout
- `VclGridComponent` — CSS grid layout

### `vcl-forms`
Form abstractions:
- `FormFieldDefinition<T>` — typed form field metadata
- `FormSectionDefinition` — grouped form sections

### `vcl-actions`
Command system:
- `ActionDefinition` — id, label, icon, shortcut, execute, canExecute
- `ActionService` — register, execute, keyboard shortcut dispatch

### `vcl-dialogs`
Overlay services:
- `VclDialogComponent` — native `<dialog>` with focus trap and backdrop
- `VclToastContainerComponent` — accessible toast notifications
- `DialogService` — promise-based confirm/alert API
- `ToastService` — signal-based toast queue

### `vcl-data`
Data access layer:
- `DataSource<T>` — typed paged data source interface
- `CustomerDataSource` — HTTP REST data source for the Customers API
- `VclDataGridComponent` — sortable, filterable, paginated data table

### `vcl-theming`
Token-based styling:
- CSS custom properties for color, spacing, typography, shadow, radius
- Light / dark / system / high-contrast themes
- `ThemeService` — signal-based runtime theme switching with persistence

## Theme Tokens

```css
--vcl-color-primary      /* Brand blue */
--vcl-color-surface      /* Card/panel background */
--vcl-color-text         /* Body text */
--vcl-space-{1-8}        /* Spacing scale */
--vcl-radius-{sm,md,lg}  /* Border radius */
--vcl-focus-ring         /* Accessible focus indicator */
```

Import `projects/vcl-theming/src/lib/styles/tokens.scss` in your global stylesheet.

## Backend API

Base URL: `/api/v1`

| Method | Path                   | Description             |
|--------|------------------------|-------------------------|
| GET    | `/customers`           | Paginated customer list |
| GET    | `/customers/{id}`      | Get customer by ID      |
| POST   | `/customers`           | Create customer         |
| PUT    | `/customers/{id}`      | Update customer         |
| DELETE | `/customers/{id}`      | Delete customer         |
| GET    | `/health`              | Health check            |

Query parameters for `GET /customers`: `page`, `pageSize`, `sort`, `filter`.

## Desktop Bridge (WebView2)

The `NativeBridgeService` sends typed JSON messages to the .NET host:

```typescript
// Angular side
bridgeService.send<{ path: string }, string>('file.open', { path: '/docs' })
  .subscribe(result => console.log(result));
```

Allowed message types: `file.open`, `file.save`, `notification.show`,
`window.minimize`, `window.maximize`, `window.close`,
`clipboard.read`, `clipboard.write`.

## Testing

```bash
# Angular unit tests (Vitest)
cd frontend && ng test vcl-components --no-watch

# .NET unit tests (xUnit)
cd backend && dotnet test ComponentPlatform.sln
```

## License

MIT
