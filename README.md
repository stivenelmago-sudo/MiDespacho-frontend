# 📋 MiDespacho - Frontend

> **Gestión moderna de casos legales | Modern law office management platform**

---

## ✨ Aplicación Premium de Gestión de Expedientes

MiDespacho es una **solución integral** para abogados y despachos jurídicos, construida con la última tecnología web.

| Aspecto | Características |
|--------|-----------------|
| 🎯 **Interfaz** | Moderna, intuitiva y responsiva |
| 📱 **Compatible** | Escritorio, Tablet, Móvil |
| ⚡ **Rendimiento** | Ultra rápida y optimizada |
| 🔒 **Seguridad** | TypeScript strict mode |
| 🎨 **Diseño** | Tailwind CSS + SCSS personalizado |

---

## 🏗️ Stack Tecnológico

```
┌─────────────────────────────────────┐
│   📦 Angular 21.1.0 Standalone     │
├─────────────────────────────────────┤
│ • TypeScript 5.9.2 (Strict Mode)   │
│ • Signals - State Management       │
│ • Tailwind CSS + SCSS              │
│ • Vitest + TestBed (Testing)       │
│ • Angular CLI 21.1.4               │
└─────────────────────────────────────┘
```

## 🚀 Inicio Rápido

### 📋 Requisitos Previos

```bash
Node.js 22.10.7+ | npm 10.9.3+ | Angular CLI 21.1.4 (opcional)
```

### 💾 Instalación

```bash
# Clonar y entrar al directorio
cd MiDespacho-frontend

# Instalar dependencias
npm install

# ¡Listo! ✅
```

### ⚡ Comandos Principales

```bash
# 🔥 Servidor de desarrollo (puerto 4200)
npm run start

# 📦 Build para producción
npm run build

# 👁️  Modo watch
npm run watch

# 🧪 Pruebas unitarias
npm run test

# 📊 Pruebas con cobertura
npm run test:cov

# 🌐 E2E tests
npm run test:e2e
```

---

## 📸 Capturas de Pantalla

### 🏠 Dashboard Principal
Pantallazo del inicio con estadísticas y casos recientes

![Dashboard - Panel Principal](./docs/screenshots/01-dashboard.png)

**Características mostradas:**
- 📊 Estadísticas en tiempo real (24 casos activos, 156 documentos)
- ✅ Expedientes recientes con estado
- 🕒 Próximas acciones y tareas pendientes
- 📈 Métricas de productividad

---

### 📁 Gestión de Expedientes
Vista completa de expedientes con filtros y búsqueda

![Gestión de Expedientes](./docs/screenshots/02-cases.png)

**Características mostradas:**
- 🔍 Búsqueda y filtros avanzados
- 📋 Lista completa de casos activos
- 🏷️ Estados de expedientes
- ➕ Crear nuevos casos
- 📂 Organización por carpetas

---

### 📄 Gestor de Documentos
Organización completa de documentos por categorías

![Gestor de Documentos](./docs/screenshots/03-documents.png)

**Características mostradas:**
- 📁 Organización por categorías
- 🔗 Vincular documentos a expedientes
- 📤 Cargar nuevos documentos
- 📥 Descargar y compartir
- 🏷️ Etiquetado inteligente
- 🔐 Control de permisos

---

### ⚙️ Configuración
Personalización completa de preferencias y parámetros

![Configuración](./docs/screenshots/04-configuration.png)

**Opciones disponibles:**
- 👤 Gestión de usuario y perfil
- 🏢 Configuración del despacho
- 🔒 Seguridad y autenticación
- 🔔 Notificaciones y alertas
- 🎨 Temas (Claro/Oscuro)
- 📤 Importar/Exportar datos
- 🌐 Integraciones con sistemas externos

---

## 🎨 Interfaz de Usuario

## 🎨 Interfaz de Usuario

### 🎯 Características Principales

✨ **Componentes Standalone** - Sin dependencias de NgModules
🎪 **Control Flow Moderno** - `@if`, `@for`, `@switch`
📊 **State Reactivo** - Signals de Angular
🔄 **Change Detection OnPush** - Rendimiento optimizado
📱 **Responsive Design** - Funciona en cualquier dispositivo

### 🎨 Paleta de Colores

```css
🔵 Primario:    #2563EB (Azul)
⚪ Secundario:  #F3F4F6 (Gris Claro)
⬛ Oscuro:      #1F2937 (Gris Oscuro)
🟢 Éxito:       #10B981 (Verde)
🟠 Alerta:      #F59E0B (Naranja)
🔴 Error:       #EF4444 (Rojo)
```

---

## 🏗️ Arquitectura

### 📂 Estructura de Carpetas

```
src/app/
├── 🎯 app.config.ts           # Configuración global
├── 🛣️  app.routes.ts           # Enrutamiento
├── 📦 app.ts                   # Componente raíz
│
├── 🧩 components/             # Componentes reutilizables
│   ├── dashboard/             # Panel principal
│   ├── expedient-detail/      # Detalle de caso
│   ├── document-set-list/     # Listado de documentos
│   ├── configuration/         # Configuración
│   ├── header/                # Encabezado
│   ├── sidebar/               # Menú lateral
│   └── ...más componentes
│
├── 🔧 services/               # Servicios compartidos
│   ├── expedient.service.ts
│   └── document.service.ts
│
└── 📋 models/                 # Interfaces TypeScript
    ├── expedient.model.ts
    └── document.model.ts
```

### 🔄 Patrones Principales

#### 1️⃣ Signals para Estado

```typescript
// Estados reactivos simples
protected readonly count = signal(0);
protected readonly isLoading = signal(false);

// Estados computados
protected readonly doubleCount = computed(() => this.count() * 2);

// Efectos secundarios
effect(() => {
  console.log('Cambio detectado:', this.count());
});
```

#### 2️⃣ Inyección de Dependencias

```typescript
@Injectable({ providedIn: 'root' })
export class ExpedientService {
  constructor(private http: HttpClient) {}
}

@Component({...})
export class MyComponent {
  constructor(private expedientService: ExpedientService) {}
}
```

#### 3️⃣ Control Flow Moderno

```html
<!-- Condicionales -->
@if (isLoading()) {
  <p>Cargando...</p>
}

<!-- Iteraciones -->
@for (case of cases(); track case.id) {
  <div>{{ case.name }}</div>
}

<!-- Switch -->
@switch (status()) {
  @case ('active') { <span>✅ Activo</span> }
  @case ('review') { <span>⏳ En Revisión</span> }
  @default { <span>❓ Desconocido</span> }
}
```

#### 4️⃣ Change Detection OnPush

```typescript
@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...'
})
export class CardComponent {
  @Input() data: any;
  // Más eficiente con Signals
}
```

---

## 🛣️ Rutas Principales

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Dashboard | Panel principal |
| `/expedients` | MyExpedientsComponent | Listado de casos |
| `/expedients/:id` | ExpedientDetailComponent | Detalle del caso |
| `/documents` | DocumentsComponent | Gestor de documentos |
| `/configuration` | ConfigurationComponent | Configuración |

---

## 🎨 Estilos y Temas

### Tailwind CSS + SCSS

- ✅ **Tailwind CSS** - Utilidades CSS modernas
- ✅ **SCSS** - Estilos componentes personalizados
- ✅ **Variables CSS** - Temas dinámicos
- ✅ **Prettier** - Formato automático

```bash
npm run lint    # Ver problemas
npm run format  # Formatear código
```

---

## 🌐 Integración Backend

## 🌐 Integración Backend

La aplicación se conecta a la API del Backend (puerto 3000 por defecto):

```typescript
// En ExpedientService
export class ExpedientService {
  constructor(private http: HttpClient) {}

  getExpedientes() {
    return this.http.get('/api/expedientes');
  }

  createExpediente(data: CreateExpedientDTO) {
    return this.http.post('/api/expedientes', data);
  }

  updateExpediente(id: string, data: UpdateExpedientDTO) {
    return this.http.put(`/api/expedientes/${id}`, data);
  }

  deleteExpediente(id: string) {
    return this.http.delete(`/api/expedientes/${id}`);
  }
}
```

Configura la URL base en `src/app/app.config.ts` si es necesario.

---

## 🚀 Generación de Código

Usa Angular CLI para generar componentes y estructuras:

```bash
# 🧩 Componente standalone nuevo
ng generate component components/my-component

# 🔧 Servicio nuevo
ng generate service services/my-service

# 📌 Directiva nueva
ng generate directive directives/my-directive

# 📖 Ver todas las opciones
ng generate --help
```

---

## 📊 Configuración de Build

### Límites de Tamaño

```json
{
  "initialBudget": "500KB",
  "componentStyles": "4KB"
}
```

Configurable en `angular.json` → `architects.build.configurations.production.budgets`

### Source Maps

```
Desarrollo:   ✅ Habilitado
Producción:   ❌ Deshabilitado (reducir tamaño)
```

---

## 🔍 Linting y Formato

### Verificar Problemas

```bash
npm run lint
```

### Formatear Código

```bash
npm run format
```

**Configuración:**
- **ESLint:** `eslint.config.mjs`
- **Prettier:** Automáticamente formatea SCSS y HTML

---

## 📦 Build Optimizado

```bash
npm run build
```

Genera archivos optimizados en `dist/mi-despacho/`:

✨ **Optimizaciones:**
- ✅ Hash en nombres (cache busting)
- ✅ Tree-shaking de código no usado
- ✅ Minificación y compresión
- ✅ Lazy loading de rutas
- ✅ Bundling inteligente

---

## 🌥️ Despliegue

### Opciones de Hosting

```
🚀 Netlify     → Conectar repositorio → Deploy automático
🚀 Vercel      → Zero-config deployment
🚀 GitHub Pages → Static hosting gratuito
🚀 AWS S3      → CloudFront CDN
🚀 Google Cloud → Cloud Storage + CDN
🚀 Azure       → Static Web Apps
```

### Configuración Nginx (SPA)

```nginx
server {
  listen 80;
  server_name example.com;

  root /var/www/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache busting para archivos hash
  location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## 📱 Comandos Útiles Rápidos

```bash
# Desarrollo rápido
npm run start

# Compilar y servir
npm run build && npm run preview

# Pruebas con watch
npm run test -- --watch

# Limpiar y reinstalar
npm run clean && npm install

# Análisis de bundel
ng analyze

# Actualizar Angular
ng update @angular/core @angular/cli
```

---

## 🐛 Solución de Problemas

### ❌ Puerto 4200 en uso

```bash
ng serve --port 4300
```

### ❌ Errores de módulos

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ❌ Fallan las pruebas

```bash
npm run test -- --no-coverage --watch=false
```

### ❌ Error de CORS

Verifica la configuración en `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([...]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
  ],
};
```

---

## 📚 Documentación Adicional

| Recurso | Enlace |
|---------|--------|
| 📖 Angular Oficial | https://angular.dev |
| 🎨 Tailwind CSS | https://tailwindcss.com |
| 🧪 Vitest | https://vitest.dev |
| TypeScript | https://www.typescriptlang.org |
| SCSS | https://sass-lang.com |

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

📝 **MIT License** - Libre para uso comercial y personal
