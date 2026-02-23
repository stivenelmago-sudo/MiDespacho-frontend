import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpedienteService } from '../../services/expediente.service';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="card">
      <div class="card-header">
        <h3>Cargar Nuevos Documentos</h3>
      </div>

      <form (ngSubmit)="onSubmit()" #uploadForm="ngForm">
        <div class="space-y-4">
          <!-- Campo Título -->
          <div>
            <label for="titulo" class="block text-sm font-medium text-gray-700">
              Título del Conjunto
            </label>
            <input
              id="titulo"
              type="text"
              [(ngModel)]="titulo"
              name="titulo"
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-legal-blue-500"
              placeholder="Ej: Demanda inicial"
              required
            />
          </div>

          <!-- Campo Descripción -->
          <div>
            <label for="descripcion" class="block text-sm font-medium text-gray-700">
              Descripción (Opcional)
            </label>
            <textarea
              id="descripcion"
              [(ngModel)]="descripcion"
              name="descripcion"
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-legal-blue-500"
              placeholder="Descripción de los documentos..."
              rows="3"
            ></textarea>
          </div>

          <!-- Campo archivos con drag & drop -->
          <div
            class="mt-4 border-2 border-dashed border-legal-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-legal-blue-500 transition-colors"
            (drop)="onDrop($event)"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            [class.bg-legal-blue-50]="isDragging()"
          >
            <div class="space-y-2">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-10-6l-3.172-3.172a2 2 0 00-2.828 0L22 14m10-6v4m0 0l-4-4m4 4l4-4"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p class="text-sm font-medium text-gray-700">
                Arrastra archivos aquí o
                <span class="text-legal-blue-600 cursor-pointer" (click)="fileInput.click()">
                  haz clic para seleccionar
                </span>
              </p>
              <p class="text-xs text-gray-500">Formatos permitidos: PDF, DOC, DOCX, JPG, PNG</p>
              <input
                #fileInput
                type="file"
                multiple
                hidden
                (change)="onFileSelected($event)"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
          </div>

          <!-- Lista de archivos seleccionados -->
          @if (selectedFiles().length > 0) {
            <div class="mt-4">
              <h4 class="font-medium text-gray-700 mb-2">
                Archivos seleccionados ({{ selectedFiles().length }})
              </h4>
              <ul class="space-y-2">
                @for (file of selectedFiles(); let idx = $index; track idx) {
                  <li
                    class="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">
                          {{ formatFileSize(file.size) }}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="removeFile(idx)"
                      class="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              [disabled]="isUploading() || selectedFiles().length === 0"
              class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isUploading()) {
                Cargando...
              } @else {
                Cargar Documentos
              }
            </button>
            <button
              type="button"
              (click)="resetForm()"
              [disabled]="isUploading()"
              class="btn-secondary disabled:opacity-50"
            >
              Limpiar
            </button>
          </div>

          <!-- Mensaje de error -->
          @if (errorMessage()) {
            <div class="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {{ errorMessage() }}
            </div>
          }

          <!-- Mensaje de éxito -->
          @if (successMessage()) {
            <div class="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {{ successMessage() }}
            </div>
          }
        </div>
      </form>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FileUploadComponent implements OnInit {
  @Input() expedienteId: string = '';
  @Output() uploadSuccess = new EventEmitter<void>();

  protected readonly titulo = signal('');
  protected readonly descripcion = signal('');
  protected readonly selectedFiles = signal<File[]>([]);
  protected readonly isUploading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly isDragging = signal(false);

  constructor(private readonly expedienteService: ExpedienteService) {}

  ngOnInit(): void {
    // Inicializar si es necesario
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles.set(files);
      this.errorMessage.set('');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);
      this.selectedFiles.set(files);
      this.errorMessage.set('');
    }
  }

  removeFile(index: number): void {
    const files = this.selectedFiles().filter((_, idx) => idx !== index);
    this.selectedFiles.set(files);
  }

  onSubmit(): void {
    if (!this.titulo() || this.selectedFiles().length === 0) {
      this.errorMessage.set('Por favor completa el título y selecciona al menos un archivo');
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.expedienteService
      .uploadFiles(this.expedienteId, this.titulo(), this.descripcion(), this.selectedFiles())
      .subscribe({
        next: () => {
          this.isUploading.set(false);
          this.successMessage.set('Documentos cargados correctamente');
          this.resetForm();
          this.uploadSuccess.emit();

          // Limpiar mensaje después de 3 segundos
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (error) => {
          this.isUploading.set(false);
          this.errorMessage.set(error?.error?.message || 'Error al cargar los documentos');
        },
      });
  }

  resetForm(): void {
    this.titulo.set('');
    this.descripcion.set('');
    this.selectedFiles.set([]);
    this.errorMessage.set('');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
