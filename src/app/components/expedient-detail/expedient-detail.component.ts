import { Component, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Expedient, DocumentSet } from '../../models/expedient.model';
import { ExpedientService } from '../../services/expedient.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { DocumentSetsSectionComponent } from '../document-sets-section/document-sets-section.component';

@Component({
  selector: 'app-expedient-detail',
  templateUrl: './expedient-detail.component.html',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, DocumentSetsSectionComponent],
})
export class ExpedientDetailComponent implements OnInit {
  protected readonly expedient = signal<Expedient | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  private expedientId: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly expedientService: ExpedientService,
  ) {
    // Effect to reload expedient when necessary
    effect(() => {
      if (this.expedientId) {
        this.loadExpedient();
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.expedientId = params['id'];
      this.loadExpedient();
    });
  }

  private loadExpedient(): void {
    this.isLoading.set(true);
    this.expedientService.getExpedient(this.expedientId).subscribe({
      next: (data) => {
        this.expedient.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading expedient:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Error loading expedient');
      },
    });
  }

  onUploadSuccess(): void {
    this.loadExpedient();
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getTotalFiles(expediente: Expedient): number {
    return expediente.document_sets.reduce(
      (sum: number, set: DocumentSet) => sum + set.files.length,
      0,
    );
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      Active: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
      'In Review': 'bg-yellow-100 text-yellow-800',
      Suspended: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusDot(status: string): string {
    const classes: Record<string, string> = {
      Active: 'bg-green-500',
      Closed: 'bg-gray-500',
      'In Review': 'bg-yellow-500',
      Suspended: 'bg-red-500',
    };
    return classes[status] || 'bg-gray-500';
  }
}
