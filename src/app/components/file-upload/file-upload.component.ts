import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpedientService } from '../../services/expedient.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FileUploadComponent {
  @Input() expedientId: string = '';
  @Output() uploadSuccess = new EventEmitter<void>();

  protected readonly title = signal('');
  protected readonly description = signal('');
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

  constructor(private readonly expedientService: ExpedientService) {}

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
        errors.push(`${file.name} exceeds maximum size of 10 MB`);
      }

      if (!this.ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name} has an unsupported format. Use PDF, DOC, DOCX, JPG or PNG`);
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

    this.expedientService
      .uploadFiles(this.expedientId, this.title(), this.description(), this.selectedFiles())
      .subscribe({
        next: () => {
          this.isUploading.set(false);
          this.successMessage.set('✅ Documents uploaded successfully');
          this.resetForm();
          this.uploadSuccess.emit();

          setTimeout(() => this.successMessage.set(''), 4000);
        },
        error: (error) => {
          this.isUploading.set(false);
          const errorMsg = error?.error?.message || 'Error uploading documents. Try again.';
          this.errorMessage.set(errorMsg);
        },
      });
  }

  private validateSubmit(): string[] {
    const errors: string[] = [];

    if (!this.title().trim()) {
      errors.push('Set title is required');
    }

    if (this.selectedFiles().length === 0) {
      errors.push('You must select at least one file');
    }

    return errors;
  }

  resetForm(): void {
    this.title.set('');
    this.description.set('');
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
