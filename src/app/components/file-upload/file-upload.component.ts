import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpedienteService } from '../../services/expediente.service';

@Component({
  selector: 'app-file-upload',
  template: `
    <section
      class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
      role="region"
      aria-labelledby="upload-title"
    >
      <!-- Header con gradient -->
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-6 sm:px-8">
        <h2 id="upload-title" class="text-2xl font-bold text-white flex items-center gap-3">
          <span class="text-3xl">📤</span>
          <span>Cargar Nuevos Documentos</span>
        </h2>
        <p class="text-green-100 mt-2 text-sm">Carga documentos organizados en conjuntos</p>
      </div>

      <form
        (ngSubmit)="onSubmit()"
        #uploadForm="ngForm"
        aria-label="Formulario de carga de documentos"
        class="px-6 py-8 sm:px-8"
      >
        <div class="space-y-6">
          <!-- Campo Título -->
          <div class="form-group">
            <label
              for="titulo"
              class="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide"
            >
              Título del Conjunto
              <span class="text-red-500">*</span>
            </label>
            <input
              id="titulo"
              type="text"
              [(ngModel)]="titulo"
              name="titulo"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              placeholder="Ej: Demanda inicial"
              aria-required="true"
              aria-describedby="titulo-desc"
              required
            />
            <p id="titulo-desc" class="text-xs text-gray-600 mt-1">
              Proporciona un nombre descriptivo para este conjunto
            </p>
          </div>

          <!-- Campo Descripción -->
          <div class="form-group">
            <label for="descripcion" class="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Descripción
              <span class="text-xs text-gray-500 font-normal">(opcional)</span>
            </label>
            <textarea
              id="descripcion"
              [(ngModel)]="descripcion"
              name="descripcion"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
              placeholder="Añade detalles adicionales..."
              rows="3"
              aria-describedby="descripcion-desc"
            ></textarea>
            <p id="descripcion-desc" class="text-xs text-gray-600 mt-1">
              Proporciona contexto adicional para facilitar la búsqueda
            </p>
          </div>

          <!-- Campo archivos con drag & drop -->
          <div class="form-group">
            <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Selecciona Documentos
              <span class="text-red-500">*</span>
            </label>
            <div
              role="region"
              aria-label="Área para cargar archivos por arrastre o clic"
              aria-describedby="file-upload-help"
              class="relative border-3 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300"
              [class]="isDragging() ? 'border-green-500 bg-green-100 shadow-lg' : 'border-green-300 hover:border-green-400 bg-gradient-to-b from-green-50 to-white'"
              [attr.aria-busy]="isUploading()"
              (drop)="onDrop($event)"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
            >
              <div class="space-y-4">
                <div aria-hidden="true" class="text-6xl">📁</div>
                <div>
                  <p class="text-lg font-bold text-gray-900 mb-2">Arrastra archivos aquí</p>
                  <p class="text-gray-600 mb-3">o</p>
                  <button
                    type="button"
                    (click)="fileInput.click()"
                    class="inline-block px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    aria-label="Selecciona desde tu dispositivo"
                  >
                    Selecciona desde tu PC
                  </button>
                  <p id="file-upload-help" class="text-xs text-gray-600 mt-4">
                    <strong>Formatos:</strong> PDF, DOC, DOCX, JPG, PNG<br />
                    <strong>Límite:</strong> 10 MB por archivo
                  </p>
                </div>
                @if (isUploading()) {
                  <p
                    aria-live="polite"
                    aria-atomic="true"
                    class="text-gray-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <span class="animate-spin">⏳</span>
                    Cargando archivos...
                  </p>
                }
              </div>
              <input
                #fileInput
                type="file"
                multiple
                hidden
                (change)="onFileSelected($event)"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                aria-label="Seleccionar archivos para cargar"
              />
            </div>
          </div>

          <!-- Lista de archivos seleccionados -->
          @if (selectedFiles().length > 0) {
            <div role="region" aria-label="Archivos seleccionados" class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📋</span>
                Archivos seleccionados ({{ selectedFiles().length }})
              </h4>
              <ul class="space-y-2" role="list">
                @for (file of selectedFiles(); let idx = $index; track idx) {
                  <li
                    class="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all"
                    role="listitem"
                  >
                    <div class="flex items-center space-x-3 flex-1 min-w-0">
                      <span aria-hidden="true">📄</span>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate" [title]="file.name">
                          {{ file.name }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="removeFile(idx)"
                      class="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded p-2 transition-colors font-bold"
                      [attr.aria-label]="'Eliminar archivo: ' + file.name"
                    >
                      ✕
                    </button>
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Botones de acción -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              [disabled]="isUploading() || selectedFiles().length === 0 || !titulo().trim()"
              class="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              [attr.aria-busy]="isUploading()"
            >
              @if (isUploading()) {
                <span>⏳ Cargando...</span>
              } @else {
                <span>📤 Cargar Documentos</span>
              }
            </button>
            <button
              type="button"
              (click)="resetForm()"
              [disabled]="isUploading()"
              class="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              aria-label="Limpiar formulario"
            >
              <span>↻ Limpiar</span>
            </button>
          </div>

          <!-- Validación de errores -->
          @if (validationErrors().length > 0) {
            <div role="alert" aria-live="assertive" class="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg space-y-2">
              <p class="font-semibold text-yellow-900 flex items-center gap-2">
                <span>⚠️</span>
                Por favor revisa los errores:
              </p>
              <ul class="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                @for (error of validationErrors(); track error) {
                  <li>{{ error }}</li>
                }
              </ul>
            </div>
          }

          <!-- Mensaje de error -->
          @if (errorMessage()) {
            <div role="alert" aria-live="assertive" class="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg text-red-700 flex items-start gap-3">
              <span>❌</span>
              <span class="flex-1">{{ errorMessage() }}</span>
            </div>
          }

          <!-- Mensaje de éxito -->
          @if (successMessage()) {
            <div role="status" aria-live="polite" class="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg text-green-700 flex items-start gap-3">
              <span>✅</span>
              <span class="flex-1">{{ successMessage() }}</span>
            </div>
          }
        </div>
      </form>
    </section>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FileUploadComponent {
  @Input() expedienteId: string = '';
  @Output() uploadSuccess = new EventEmitter<void>();

  protected readonly titulo = signal('');
  protected readonly descripcion = signal('');
  protected readonly selectedFiles = signal<File[]>([]);
  protected readonly isUploading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly isDragging = signal(false);
  protected readonly validationErrors = signal<string[]>([]);

  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  private readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];

  constructor(private readonly expedienteService: ExpedienteService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const validationErrors = this.validateFiles(files);

      if (validationErrors.length > 0) {
        this.validationErrors.set(validationErrors);
        return;
      }

      this.selectedFiles.set(files);
      this.errorMessage.set('');
      this.validationErrors.set([]);
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
      const validationErrors = this.validateFiles(files);

      if (validationErrors.length > 0) {
        this.validationErrors.set(validationErrors);
        return;
      }

      this.selectedFiles.set(files);
      this.errorMessage.set('');
      this.validationErrors.set([]);
    }
  }

  private validateFiles(files: File[]): string[] {
    const errors: string[] = [];

    files.forEach((file) => {
      if (file.size > this.MAX_FILE_SIZE) {
        errors.push(`${file.name} excede el tamaño máximo de 10 MB`);
      }

      if (!this.ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name} tiene un formato no permitido. Usa PDF, DOC, DOCX, JPG o PNG`);
      }
    });

    return errors;
  }

  removeFile(index: number): void {
    const files = this.selectedFiles().filter((_, idx) => idx !== index);
    this.selectedFiles.set(files);
  }

  onSubmit(): void {
    const errors = this.validateSubmit();

    if (errors.length > 0) {
      this.validationErrors.set(errors);
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.validationErrors.set([]);

    this.expedienteService
      .uploadFiles(this.expedienteId, this.titulo(), this.descripcion(), this.selectedFiles())
      .subscribe({
        next: () => {
          this.isUploading.set(false);
          this.successMessage.set('✅ Documentos cargados correctamente');
          this.resetForm();
          this.uploadSuccess.emit();

          setTimeout(() => this.successMessage.set(''), 4000);
        },
        error: (error) => {
          this.isUploading.set(false);
          const errorMsg =
            error?.error?.message || 'Error al cargar los documentos. Intenta nuevamente.';
          this.errorMessage.set(errorMsg);
        },
      });
  }

  private validateSubmit(): string[] {
    const errors: string[] = [];

    if (!this.titulo().trim()) {
      errors.push('El título del conjunto es requerido');
    }

    if (this.selectedFiles().length === 0) {
      errors.push('Debes seleccionar al menos un archivo');
    }

    return errors;
  }

  resetForm(): void {
    this.titulo.set('');
    this.descripcion.set('');
    this.selectedFiles.set([]);
    this.errorMessage.set('');
    this.validationErrors.set([]);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
