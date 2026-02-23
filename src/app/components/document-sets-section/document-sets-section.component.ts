import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentSet } from '../../models/expediente.model';
import { ExpedienteService } from '../../services/expediente.service';
import { DocumentSetListComponent } from '../document-set-list/document-set-list.component';

@Component({
  selector: 'app-document-sets-section',
  standalone: true,
  imports: [CommonModule, FormsModule, DocumentSetListComponent],
  templateUrl: './document-sets-section.html',
  styleUrl: './document-sets-section.scss',
})
export class DocumentSetsSectionComponent {
  @Input() documentSets: DocumentSet[] = [];
  @Input() expedienteId: string = '';
  @Output() documentsRefresh = new EventEmitter<void>();

  protected isAddingNew = signal(false);
  protected newSetTitle = signal('');
  protected newSetDescription = signal('');

  constructor(private readonly expedienteService: ExpedienteService) {}

  onDocumentDeleted(): void {
    this.documentsRefresh.emit();
  }

  onFileDeleted(): void {
    this.documentsRefresh.emit();
  }

  toggleAddNew(): void {
    this.isAddingNew.update((val) => !val);
    if (!this.isAddingNew()) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newSetTitle.set('');
    this.newSetDescription.set('');
  }

  addNewSet(): void {
    if (!this.newSetTitle().trim()) {
      alert('El título del conjunto es requerido');
      return;
    }

    // Aquí iría la lógica para crear un nuevo conjunto
    // Por ahora es un placeholder para futura implementación
    console.log('Crear nuevo conjunto:', {
      titulo: this.newSetTitle(),
      descripcion: this.newSetDescription(),
      expedienteId: this.expedienteId,
    });

    this.isAddingNew.set(false);
    this.resetForm();
    this.documentsRefresh.emit();
  }
}
