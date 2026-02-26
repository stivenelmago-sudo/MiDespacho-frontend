# MiDespacho - Frontend

Aplicación web moderna para gestión de despachos construida con **Angular 21** y componentes standalone.

## 📋 Descripción

MiDespacho Frontend es una aplicación SPA (Single Page Application) desarrollada con Angular 21 que proporciona una interfaz moderna y responsiva para la gestión de expedientes, documentos y archivos.

**Stack Tecnológico:**
- **Framework:** Angular 21.1.0
- **Lenguaje:** TypeScript 5.9.2 (strict mode)
- **Testing:** Vitest + TestBed
- **Estilos:** SCSS + Tailwind CSS
- **State:** Angular Signals
- **Build:** Angular CLI 21.1.4

## 🚀 Configuración Rápida

### Requisitos Previos
- Node.js 22.10.7 o superior
- npm 10.9.3 o superior
- Angular CLI 21.1.4 (opcional, se puede usar `ng`)

### Instalación

```bash
npm install
```

## 🏃 Comandos Principales

```bash
# Servidor de desarrollo (puerto 4200)
npm run start

# Compilar para producción
npm run build

# Modo watch
npm run watch
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 🛠️ Code Generation

Usa Angular CLI para generar componentes y other structures:

```bash
# Generar nuevo componente standalone
ng generate component components/mi-componente

# Generar servicio
ng generate service services/mi-servicio

# Generar directiva
ng generate directive directives/mi-directiva

# Ver todas las opciones disponibles
ng generate --help
```

## 🏗️ Arquitectura

### Componentes Standalone

Todos los componentes de esta aplicación son **standalone**, lo que significa que no dependen de NgModules:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  // Lógica del componente
}
```

### Estructura de Carpetas

```
src/
├── app/
│   ├── app.config.ts              # Providers globales
│   ├── app.routes.ts              # Rutas principales
│   ├── app.ts                     # Componente raíz
│   ├── components/                # Componentes reutilizables
│   │   ├── dashboard/
│   │   ├── expedientes/
│   │   ├── documento-sets/
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── ...
│   ├── services/                  # Servicios compartidos
│   │   ├── expediente.service.ts
│   │   └── ...
│   └── models/                    # Modelos TypeScript
│       ├── expediente.model.ts
│       └── ...
├── styles.scss                    # Estilos globales
├── main.ts                        # Bootstrap
└── index.html                     # HTML principal
```

### Patrones Clave

#### 1. Signals para State Management

```typescript
// Usar signals en lugar de propiedades simples
protected readonly count = signal(0);
protected readonly isLoading = signal(false);

// Signals computados
protected readonly doubleCount = computed(() => this.count() * 2);

// Efectos
effect(() => {
  console.log('Count cambió a:', this.count());
});
```

#### 2. Inyección de Dependencias

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  // Lógica del servicio
}

@Component({...})
export class MyComponent {
  constructor(private myService: MyService) {}
}
```

#### 3. Control Flow Moderno

```html
<!-- if -->
@if (isLoading()) {
  <p>Cargando...</p>
}

<!-- for -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- switch -->
@switch (status()) {
  @case ('active') { <span>Activo</span> }
  @case ('inactive') { <span>Inactivo</span> }
  @default { <span>Desconocido</span> }
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
  // OnPush es más eficiente con Signals
}
```

## 📱 Rutas Principales

Las rutas están definidas en `src/app/app.routes.ts`:

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Dashboard | Página principal |
| `/expedientes` | ExpedientesComponent | Listado de expedientes |
| `/expedientes/:id` | ExpedienteDetailComponent | Detalle de expediente |
| `/configuracion` | ConfiguracionComponent | Configuración de la app |

## 🎨 Estilos

- **SCSS:** Todos los componentes usan SCSS para estilos
- **Tailwind CSS:** Framework de utilidades CSS integrado
- **Prettier:** Formatea automáticamente estilos

```bash
# Aplicar estilos según config
npm run lint
```

## 🌐 Integración con Backend

La aplicación se conecta a la API Backend (puerto 3000 por defecto):

```typescript
// En ExpedienteService
export class ExpedienteService {
  constructor(private http: HttpClient) {}

  getExpedientes() {
    return this.http.get('/api/expedientes');
  }
}
```

Configura la URL base del API en `src/app/app.config.ts` si es necesario.

## 📊 Configuración de Builds

### Límites de Tamaño
- Initial: 500KB
- Component styles: 4KB

Configurable en `angular.json` → `architects.build.configurations.production.budgets`

### Source Maps
- **Desarrollo:** Habilitados
- **Producción:** Deshabilitados (para reducir tamaño)

## 🔍 Linting & Formatting

```bash
# Ver problemas de linting
npm run lint

# Formatear código
npm run format
```

Configuración:
- **ESLint:** Ver `.eslintrc.json` o `eslint.config.mjs`
- **Prettier:** Automatiza formatos SCSS y HTML

## 🚀 Deployment

### Build Optimizado

```bash
npm run build
```

Genera archivos optimizados en `dist/mi-despacho/`:
- Hash en nombres para cache busting
- Tree-shaking de código no usado
- Minificación y compresión

### Hosting

Los archivos en `dist/` pueden desplegarse en:
- **Netlify, Vercel, GitHub Pages** (SPA estática)
- **Nginx/Apache** (requiere configurar SPA routing)
- **Cloud providers** (AWS S3 + CloudFront, Google Cloud Storage, etc.)

#### Configuración SPA en Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 📖 Documentación Adicional

- Desarrollo detallado: [`README-DEV.md`](README-DEV.md)
- [Angular Docs](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)

## 🔧 Troubleshooting

**Puerto 4200 en uso:**
```bash
ng serve --port 4300
```

**Problemas de módulos no encontrados:**
```bash
npm install
npm run build
```

**Tests fallan:**
```bash
npm run test -- --no-coverage
```

## 📄 Licencia

MIT

---

**Última actualización:** Febrero 2026
# MiDespacho-frontend
