import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentSet, File } from '../../models/expediente.model';
import { ExpedienteService } from '../../services/expediente.service';

@Component({
  selector: 'app-document-set-list',
  template: `
    <section role="region" aria-labelledby="document-sets-title" class="space-y-4">
      <h2 id="document-sets-title" class="text-2xl font-bold text-gray-900 mb-6">
        📚 Conjuntos de Documentos
      </h2>

      @if (_documentSets().length === 0) {
        <div class="card border-l-4 border-blue-500 bg-blue-50 animate-fade-in">
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📭</div>
            <p class="text-lg font-semibold text-gray-900">No hay documentos cargados aún</p>
            <p class="text-sm text-gray-600 mt-2">
              Carga el primer conjunto de documentos para comenzar
            </p>
          </div>
        </div>
      } @else {
        <div class="grid gap-4">
          @for (docSet of _documentSets(); track docSet.id) {
            <div
              class="card border-l-4 border-blue-500 hover:border-blue-600 hover:shadow-lg transition-all duration-300 animate-slide-up"
              role="region"
              [attr.aria-label]="'Conjunto de documentos: ' + docSet.titulo"
            >
              <!-- Header del Conjunto -->
              <div class="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">📋</span>
                    <h3 class="text-xl font-bold text-gray-900">{{ docSet.titulo }}</h3>
                  </div>
                  <p class="text-sm text-gray-600 ml-8">{{ docSet.descripcion }}</p>
                  <div class="flex gap-6 mt-3 ml-8 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <span>📁</span>
                      <strong>{{ docSet.files.length }}</strong>
                      {{ docSet.files.length === 1 ? 'archivo' : 'archivos' }}
                    </span>
                    <span class="flex items-center gap-1">
                      <span>📅</span>
                      {{ formatDate(docSet.created_at) }}
                    </span>
                  </div>
                </div>
                <button
                  (click)="deleteSet(docSet.id)"
                  [disabled]="isDeleting() === docSet.id"
                  class="btn btn-danger btn-sm ml-4 flex items-center gap-2"
                  [attr.aria-label]="'Eliminar conjunto de documentos: ' + docSet.titulo"
                  title="Eliminar conjunto"
                >
                  🗑️
                  {{ isDeleting() === docSet.id ? 'Eliminando...' : 'Eliminar' }}
                </button>
              </div>

              <!-- Lista de archivos -->
              @if (docSet.files.length > 0) {
                <div class="space-y-2">
                  <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Archivos incluidos
                  </p>
                  <ul role="list" class="space-y-2">
                    @for (file of docSet.files; track file.id) {
                      <li
                        role="listitem"
                        class="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                      >
                        <div class="flex items-center space-x-3 flex-1 min-w-0">
                          <span class="text-lg">📄</span>
                          <div class="flex-1 min-w-0">
                            <p
                              class="text-sm font-medium text-gray-900 truncate"
                              [title]="file.nombre_original"
                            >
                              {{ file.nombre_original }}
                            </p>
                            <p class="text-xs text-gray-500 mt-1">
                              <span class="text-blue-600 font-semibold">
                                {{ formatFileSize(file.tamanio_bytes) }}
                              </span>
                              •
                              {{ formatDate(file.created_at) }}
                            </p>
                          </div>
                        </div>
                        <button
                          (click)="deleteFile(file.id)"
                          [disabled]="isDeleting() === file.id"
                          class="btn btn-danger btn-sm ml-2 flex-shrink-0"
                          [attr.aria-label]="'Eliminar archivo: ' + file.nombre_original"
                          title="Eliminar archivo"
                        >
                          {{ isDeleting() === file.id ? '⏳' : '✕' }}
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
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
