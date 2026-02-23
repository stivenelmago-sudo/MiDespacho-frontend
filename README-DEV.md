# MiDespacho Frontend

Frontend Angular 21 con Standalone Components, TailwindCSS y Server-Side Rendering (SSR) para la gestión de expedientes jurídicos.

## Requisitos previos

- Node.js 22.10.7+
- npm 10.9.3+

## Instalación

```bash
# Instalar dependencias
npm install
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo (con SSR)
npm start

# El servidor estará disponible en http://localhost:4200
# SSR renderizado en server.ts
```

## Estructura de features

La aplicación está organizada con componentes standalone:

### Servicios

- **ExpedienteService** (`src/app/services/expediente.service.ts`)
  - `getExpedientes()` - Listar expedientes
  - `getExpediente(id)` - Obtener expediente
  - `createExpediente(data)` - Crear expediente
  - `updateExpediente(id, data)` - Actualizar expediente
  - `deleteExpediente(id)` - Eliminar expediente
  - `uploadFiles(expedienteId, titulo, descripcion, files)` - Cargar documentos
  - `getDocumentSet(documentSetId)` - Obtener conjunto de documentos
  - `deleteFile(fileId)` - Eliminar archivo
  - `deleteDocumentSet(documentSetId)` - Eliminar conjunto

### Componentes

- **ExpedienteDetailComponent** (`src/app/components/expediente-detail/`)
  - Vista principal del expediente
  - Muestra información del cliente, estado, fechas
  - Integra carga de documentos y listado

- **FileUploadComponent** (`src/app/components/file-upload/`)
  - Formulario para cargar múltiples archivos
  - Drag & drop soporte
  - Validaciones de archivo
  - Retroalimentación visual

- **DocumentSetListComponent** (`src/app/components/document-set-list/`)
  - Listado de conjuntos de documentos
  - Muestra archivos organizados por conjunto
  - Eliminación de documentos y conjunto

### Models

- **Expediente** - Caso jurídico
- **DocumentSet** - Conjunto de documentos
- **File** - Archivo individual

## Rutas

- `/expediente/:id` - Detalle de expediente

## Build

```bash
# Build para producción con SSR
npm run build

# La aplicación compilada está en dist/
```

## Testing

```bash
# Ejecutar tests con Vitest
npm run test

# Modo watch
npm run watch

# Cobertura
npm run test:cov
```

## Styling

El proyecto usa **TailwindCSS** con configuración custom:

- **Estados de expediente**: Colores específicos para Activo, Cerrado, En Revisión, Suspendido
- **Paleta jurídica**: Azules corporativos, grises neutrales
- **Componentes reutilizables**: `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.card`

Ver `tailwind.config.js` para personalización.

## Server-Side Rendering (SSR)

La aplicación está configurada con Angular SSR:

```bash
# Código SSR
npm run start    # Inicia server.ts

# SSR renderiza el HTML en servidor antes de enviarlo al cliente
```

Archivos SSR:

- `src/main.server.ts` - Bootstrap para servidor
- `src/server.ts` - Configuración Express + Angular
- `src/app/app.config.server.ts` - Configuración SSR
- `src/app/app.routes.server.ts` - Rutas SSR

## Integración con Backend

El servicio `ExpedienteService` se conecta al backend:

```typescript
private readonly apiUrl = 'http://localhost:3000';
```

Asegúrate de que el backend está corriendo en http://localhost:3000

## Estructura de carpetas

```
src/
├── app/
│   ├── components/
│   │   ├── expediente-detail/
│   │   ├── document-set-list/
│   │   └── file-upload/
│   ├── models/
│   │   └── expediente.model.ts
│   ├── services/
│   │   └── expediente.service.ts
│   ├── app.routes.ts           # Rutas principales
│   ├── app.config.ts           # Configuración de providers
│   ├── app.config.server.ts    # Configuración SSR
│   ├── app.ts                  # Componente raíz
│   └── app.html                # Template raíz
├── main.ts                     # Bootstrap cliente
├── main.server.ts              # Bootstrap servidor
├── server.ts                   # Servidor Express + SSR
├── styles.scss                 # Estilos globales con Tailwind
└── index.html                  # HTML raíz

angular.json                     # Configuración Angular CLI
tailwind.config.js              # Configuración TailwindCSS
postcss.config.js               # Configuración PostCSS
tsconfig.json                   # Configuración TypeScript
```

## Notas

- Componentes **standalone**: Sin NgModule, imports directos en @Component
- Signals para state management (recomendado desde Angular 17)
- TailwindCSS para styling rápido y consistente
- SSR habilitado para mejor performance y SEO

## Variables de entorno

Ninguna variable de entorno requerida en el frontend. La URL del API está hardcodeada en `ExpedienteService`:

```typescript
private readonly apiUrl = 'http://localhost:3000';
```

Para cambiarla, editar el servicio o agregar environment files.
