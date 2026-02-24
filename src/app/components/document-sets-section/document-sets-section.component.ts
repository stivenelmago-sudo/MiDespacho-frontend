import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentSet } from '../../models/expedient.model';
import { ExpedientService } from '../../services/expedient.service';
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
  @Input() expedientId: string = '';
  @Output() documentsRefresh = new EventEmitter<void>();

  protected isAddingNew = signal(false);
  protected newSetTitle = signal('');
  protected newSetDescription = signal('');

  constructor(private readonly expedientService: ExpedientService) {}

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
      alert('Set title is required');
      return;
    }

    // Logic to create a new set would go here
    // For now it's a placeholder for future implementation
    console.log('Create new set:', {
      title: this.newSetTitle(),
      description: this.newSetDescription(),
      expedientId: this.expedientId,
    });

    this.isAddingNew.set(false);
    this.resetForm();
    this.documentsRefresh.emit();
  }
}
