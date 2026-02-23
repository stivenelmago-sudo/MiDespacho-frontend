import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentSet, File } from '../../models/expediente.model';
import { ExpedienteService } from '../../services/expediente.service';

@Component({
  selector: 'app-document-set-list',
  template: `
    <div class="space-y-4">
      @if (_documentSets().length === 0) {
        <div class="card">
          <div class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-gray-600">No hay documentos cargados aún</p>
            <p class="text-sm text-gray-500 mt-1">
              Carga el primer conjunto de documentos para comenzar
            </p>
          </div>
        </div>
      } @else {
        @for (docSet of _documentSets(); track docSet.id) {
          <div class="card">
            <div class="card-header flex justify-between items-start">
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-900">{{ docSet.titulo }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ docSet.descripcion }}</p>
                <div class="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>📁 {{ docSet.files.length }} archivo(s)</span>
                  <span
                    >📅
                    {{ formatDate(docSet.created_at) }}
                  </span>
                </div>
              </div>
              <button
                (click)="deleteSet(docSet.id)"
                class="text-red-600 hover:text-red-800 ml-4"
                title="Eliminar conjunto"
              >
                🗑️
              </button>
            </div>

            <!-- Lista de archivos -->
            @if (docSet.files.length > 0) {
              <div class="space-y-2">
                @for (file of docSet.files; track file.id) {
                  <div
                    class="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div class="flex items-center space-x-3 flex-1">
                      <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ file.nombre_original }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ formatFileSize(file.tamanio_bytes) }} •
                          {{ formatDate(file.created_at) }}
                        </p>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <!-- <button
                        class="text-legal-blue-600 hover:text-legal-blue-800"
                        title="Descargar"
                      >
                        ⬇️
                      </button> -->
                      <button
                        (click)="deleteFile(file.id)"
                        class="text-red-600 hover:text-red-800"
                        title="Eliminar archivo"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class DocumentSetListComponent {
  @Input() set documentSets(value: DocumentSet[]) {
    this._documentSets.set(value);
  }

  @Output() documentDeleted = new EventEmitter<void>();
  @Output() fileDeleted = new EventEmitter<void>();

  protected readonly _documentSets = signal<DocumentSet[]>([]);
  protected readonly isDeleting = signal<string | null>(null);

  constructor(private readonly expedienteService: ExpedienteService) {}

  deleteFile(fileId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      this.isDeleting.set(fileId);
      this.expedienteService.deleteFile(fileId).subscribe({
        next: () => {
          this.isDeleting.set(null);
          this.fileDeleted.emit();
        },
        error: () => {
          this.isDeleting.set(null);
          alert('Error al eliminar el archivo');
        },
      });
    }
  }

  deleteSet(documentSetId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este conjunto de documentos?')) {
      this.isDeleting.set(documentSetId);
      this.expedienteService.deleteDocumentSet(documentSetId).subscribe({
        next: () => {
          this.isDeleting.set(null);
          this.documentDeleted.emit();
        },
        error: () => {
          this.isDeleting.set(null);
          alert('Error al eliminar el conjunto');
        },
      });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
