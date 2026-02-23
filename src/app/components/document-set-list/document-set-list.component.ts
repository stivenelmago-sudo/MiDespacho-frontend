import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentSet, File } from '../../models/expediente.model';
import { ExpedienteService } from '../../services/expediente.service';

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

  downloadFile(fileId: string, fileName: string): void {
    this.expedienteService.downloadFile(fileId);
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
