# MiDespacho - Frontend

Modern web application for law office management built with **Angular 21** and standalone components.

## 📋 Description

MiDespacho Frontend is an SPA (Single Page Application) developed with Angular 21 that provides a modern and responsive interface for managing case files, documents and files.

**Tech Stack:**
- **Framework:** Angular 21.1.0
- **Language:** TypeScript 5.9.2 (strict mode)
- **Testing:** Vitest + TestBed
- **Styles:** SCSS + Tailwind CSS
- **State:** Angular Signals
- **Build:** Angular CLI 21.1.4

## 🚀 Quick Setup

### Prerequisites
- Node.js 22.10.7 or higher
- npm 10.9.3 or higher
- Angular CLI 21.1.4 (optional, you can use `ng`)

### Installation

```bash
npm install
```

## 🏃 Main Commands

```bash
# Development server (port 4200)
npm run start

# Build for production
npm run build

# Watch mode
npm run watch
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 🛠️ Code Generation

Use Angular CLI to generate components and other structures:

```bash
# Generate new standalone component
ng generate component components/my-component

# Generate service
ng generate service services/my-service

# Generate directive
ng generate directive directives/my-directive

# See all available options
ng generate --help
```

## 🏗️ Architecture

### Standalone Components

All components in this application are **standalone**, meaning they don't depend on NgModules:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  // Component logic
}
```

### Folder Structure

```
src/
├── app/
│   ├── app.config.ts              # Global providers
│   ├── app.routes.ts              # Main routes
│   ├── app.ts                     # Root component
│   ├── components/                # Reusable components
│   │   ├── dashboard/
│   │   ├── expedientes/
│   │   ├── documento-sets/
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── ...
│   ├── services/                  # Shared services
│   │   ├── expediente.service.ts
│   │   └── ...
│   └── models/                    # TypeScript models
│       ├── expediente.model.ts
│       └── ...
├── styles.scss                    # Global styles
├── main.ts                        # Bootstrap
└── index.html                     # Main HTML
```

### Key Patterns

#### 1. Signals for State Management

```typescript
// Use signals instead of simple properties
protected readonly count = signal(0);
protected readonly isLoading = signal(false);

// Computed signals
protected readonly doubleCount = computed(() => this.count() * 2);

// Effects
effect(() => {
  console.log('Count changed to:', this.count());
});
```

#### 2. Dependency Injection

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  // Service logic
}

@Component({...})
export class MyComponent {
  constructor(private myService: MyService) {}
}
```

#### 3. Modern Control Flow

```html
<!-- if -->
@if (isLoading()) {
  <p>Loading...</p>
}

<!-- for -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- switch -->
@switch (status()) {
  @case ('active') { <span>Active</span> }
  @case ('inactive') { <span>Inactive</span> }
  @default { <span>Unknown</span> }
}
```

#### 4. Change Detection OnPush

```typescript
@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...'
})
export class CardComponent {
  @Input() data: any;
  // OnPush is more efficient with Signals
}
```

## 📱 Main Routes

Routes are defined in `src/app/app.routes.ts`:

| Route | Component | Description |
|------|-----------|-------------|
| `/` | Dashboard | Main page |
| `/expedientes` | ExpedientesComponent | Case files list |
| `/expedientes/:id` | ExpedienteDetailComponent | Case file detail |
| `/configuracion` | ConfiguracionComponent | App configuration |

## 🎨 Styles

- **SCSS:** All components use SCSS for styling
- **Tailwind CSS:** Integrated CSS utilities framework
- **Prettier:** Automatically formats styles

```bash
# Apply styles according to config
npm run lint
```

## 🌐 Backend Integration

The application connects to the Backend API (port 3000 by default):

```typescript
// In ExpedienteService
export class ExpedienteService {
  constructor(private http: HttpClient) {}

  getExpedientes() {
    return this.http.get('/api/expedientes');
  }
}
```

Configure the API base URL in `src/app/app.config.ts` if needed.

## 📊 Build Configuration

### Size Limits
- Initial: 500KB
- Component styles: 4KB

Configurable in `angular.json` → `architects.build.configurations.production.budgets`

### Source Maps
- **Development:** Enabled
- **Production:** Disabled (to reduce size)

## 🔍 Linting & Formatting

```bash
# See linting issues
npm run lint

# Format code
npm run format
```

Configuration:
- **ESLint:** See `.eslintrc.json` or `eslint.config.mjs`
- **Prettier:** Automates SCSS and HTML formats

## 🚀 Deployment

### Optimized Build

```bash
npm run build
```

Generates optimized files in `dist/mi-despacho/`:
- Hash in names for cache busting
- Tree-shaking of unused code
- Minification and compression

### Hosting

Files in `dist/` can be deployed to:
- **Netlify, Vercel, GitHub Pages** (Static SPA)
- **Nginx/Apache** (requires SPA routing configuration)
- **Cloud providers** (AWS S3 + CloudFront, Google Cloud Storage, etc.)

#### Nginx SPA Configuration

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 📖 Additional Documentation

- Detailed development: [`README-DEV.md`](README-DEV.md)
- [Angular Docs](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)

## 🔧 Troubleshooting

**Port 4200 in use:**
```bash
ng serve --port 4300
```

**Module not found issues:**
```bash
npm install
npm run build
```

**Tests failing:**
```bash
npm run test -- --no-coverage
```

## 📄 License

MIT

---

**Last updated:** February 2026
