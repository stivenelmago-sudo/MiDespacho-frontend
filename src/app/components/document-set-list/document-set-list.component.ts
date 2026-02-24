import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentSet, File } from '../../models/expedient.model';
import { ExpedientService } from '../../services/expedient.service';

@Component({
  selector: 'app-document-set-list',
  templateUrl: './document-set-list.component.html',
  styleUrl: './document-set-list.component.scss',
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

  constructor(private readonly expedientService: ExpedientService) {}

  deleteFile(fileId: string): void {
    if (confirm('Are you sure you want to delete this file?')) {
      this.isDeleting.set(fileId);
      this.expedientService.deleteFile(fileId).subscribe({
        next: () => {
          this.isDeleting.set(null);
          this.fileDeleted.emit();
        },
        error: () => {
          this.isDeleting.set(null);
          alert('Error deleting file');
        },
      });
    }
  }

  downloadFile(fileId: string, fileName: string): void {
    this.expedientService.downloadFile(fileId);
  }

  deleteSet(documentSetId: string): void {
    if (confirm('Are you sure you want to delete this document set?')) {
      this.isDeleting.set(documentSetId);
      this.expedientService.deleteDocumentSet(documentSetId).subscribe({
        next: () => {
          this.isDeleting.set(null);
          this.documentDeleted.emit();
        },
        error: () => {
          this.isDeleting.set(null);
          alert('Error deleting set');
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
