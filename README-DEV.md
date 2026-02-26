# MiDespacho Frontend

Angular 21 frontend with Standalone Components, TailwindCSS and Server-Side Rendering (SSR) for legal case file management.

## Prerequisites

- Node.js 22.10.7+
- npm 10.9.3+

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server (with SSR)
npm start

# The server will be available at http://localhost:4200
# SSR rendered in server.ts
```

## Features Structure

The application is organized with standalone components:

### Services

- **ExpedienteService** (`src/app/services/expediente.service.ts`)
  - `getExpedientes()` - List case files
  - `getExpediente(id)` - Get case file
  - `createExpediente(data)` - Create case file
  - `updateExpediente(id, data)` - Update case file
  - `deleteExpediente(id)` - Delete case file
  - `uploadFiles(expedienteId, titulo, descripcion, files)` - Upload documents
  - `getDocumentSet(documentSetId)` - Get document set
  - `deleteFile(fileId)` - Delete file
  - `deleteDocumentSet(documentSetId)` - Delete set

### Components

- **ExpedienteDetailComponent** (`src/app/components/expediente-detail/`)
  - Main case file view
  - Shows client information, status, dates
  - Integrates document upload and listing

- **FileUploadComponent** (`src/app/components/file-upload/`)
  - Form to upload multiple files
  - Drag & drop support
  - File validations
  - Visual feedback

- **DocumentSetListComponent** (`src/app/components/document-set-list/`)
  - Document sets listing
  - Shows files organized by set
  - Delete documents and sets

### Models

- **Expediente** - Legal case
- **DocumentSet** - Set of documents
- **File** - Individual file

## Routes

- `/expediente/:id` - Case file detail

## Build

```bash
# Build for production with SSR
npm run build

# The compiled application is in dist/
```

## Testing

```bash
# Run tests with Vitest
npm run test

# Watch mode
npm run watch

# Coverage
npm run test:cov
```

## Styling

The project uses **TailwindCSS** with custom configuration:

- **Case file states**: Specific colors for Active, Closed, Under Review, Suspended
- **Legal palette**: Corporate blues, neutral grays
- **Reusable components**: `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.card`

See `tailwind.config.js` for customization.

## Server-Side Rendering (SSR)

The application is configured with Angular SSR:

```bash
# SSR code
npm start    # Starts server.ts

# SSR renders HTML on server before sending to client
```

SSR files:

- `src/main.server.ts` - Server bootstrap
- `src/server.ts` - Express + Angular configuration
- `src/app/app.config.server.ts` - SSR configuration
- `src/app/app.routes.server.ts` - SSR routes

## Backend Integration

The `ExpedienteService` connects to the backend:

```typescript
private readonly apiUrl = 'http://localhost:3000';
```

Make sure the backend is running at http://localhost:3000

## Folder Structure

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
│   ├── app.routes.ts           # Main routes
│   ├── app.config.ts           # Providers configuration
│   ├── app.config.server.ts    # SSR configuration
│   ├── app.ts                  # Root component
│   └── app.html                # Root template
├── main.ts                     # Client bootstrap
├── main.server.ts              # Server bootstrap
├── server.ts                   # Express + SSR server
├── styles.scss                 # Global styles with Tailwind
└── index.html                  # Root HTML

angular.json                     # Angular CLI configuration
tailwind.config.js              # TailwindCSS configuration
postcss.config.js               # PostCSS configuration
tsconfig.json                   # TypeScript configuration
```

## Notes

- **Standalone components**: No NgModule, direct imports in @Component
- Signals for state management (recommended since Angular 17)
- TailwindCSS for fast and consistent styling
- SSR enabled for better performance and SEO

## Environment Variables

No environment variables required in the frontend. The API URL is hardcoded in `ExpedienteService`:

```typescript
private readonly apiUrl = 'http://localhost:3000';
```

To change it, edit the service or add environment files.
