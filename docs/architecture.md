# Architecture

## Overview

AI-VCL uses a layered monorepo separating frontend libraries, backend services, and desktop integration.

```
┌──────────────────────────────────────────┐
│            Angular Application           │
│  (Demo App / Component Designer / Shell) │
└───────────────┬──────────────────────────┘
                │ imports
┌───────────────▼──────────────────────────┐
│            VCL Library Layer             │
│  vcl-core  vcl-components  vcl-layout    │
│  vcl-forms vcl-data        vcl-actions   │
│  vcl-dialogs               vcl-theming   │
└───────────────┬──────────────────────────┘
                │ HTTP / WebView2 Bridge
┌───────────────▼──────────────────────────┐
│          ASP.NET Core Backend            │
│  Api → Application → Domain → Infra      │
└──────────────────────────────────────────┘
```

## Frontend Architecture

- **Standalone components**: Each component is independently importable.
- **ChangeDetectionStrategy.OnPush**: Components only re-render on input changes or signal updates.
- **Angular Signals**: Used for local reactive state in components and services.
- **RxJS**: Used for HTTP, bridge messaging, and asynchronous event streams.
- **Lazy routing**: Feature pages are loaded lazily to minimise the initial bundle.

## Backend Architecture

The backend follows Clean Architecture with four layers:

1. **Domain** — Entities, value objects, repository interfaces, domain rules. No external dependencies.
2. **Application** — Use cases, DTO mapping, FluentValidation validators. Depends only on Domain and Contracts.
3. **Infrastructure** — EF Core DbContext, repository implementations, external integrations.
4. **API** — Controllers, middleware, OpenAPI, authentication. Wires up all layers via DI.

## Desktop Architecture

The desktop host is a WPF application with an embedded WebView2 control. Angular assets are served either from `localhost:4200` (development) or from embedded static assets (production). The `NativeBridgeService` in Angular communicates with `WebViewBridgeHandler` in .NET over a JSON message channel. Only approved message types are processed; arbitrary command execution is prohibited.

## Security Boundaries

- The Angular app never calls `eval()` or `Function()` on untrusted input.
- The WebView2 bridge enforces an allowlist of accepted message types.
- All API inputs are validated with FluentValidation before reaching domain logic.
- CORS is restricted to known Angular origins.
- Problem Details responses never expose stack traces in production.
