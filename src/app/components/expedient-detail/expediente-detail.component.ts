import { Component, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Expedient } from '../../models/expedient.model';
import { ExpedientService } from '../../services/expedient.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { DocumentSetsSectionComponent } from '../document-sets-section/document-sets-section.component';

@Component({
  selector: 'app-expedient-detail',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- Header with improved gradient -->
      <div
        class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg border-b border-blue-900"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          @if (expedient(); as exp) {
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-4 mb-3">
                  <div class="p-3 bg-blue-500 rounded-lg shadow-lg">
                    <span class="text-2xl">⚖️</span>
                  </div>
                  <div>
                    <h1 class="text-4xl font-bold text-white">{{ exp.client_name }}</h1>
                    <p class="text-blue-200 mt-2 text-lg">Expedient #{{ exp.case_number }}</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div
                  [class]="
                    'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-md ' +
                    getStatusClass(exp.status)
                  "
                >
                  <span
                    class="w-2 h-2 rounded-full inline-block"
                    [class]="getStatusDot(exp.status)"
                  ></span>
                  {{ exp.status }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        @if (isLoading()) {
          <div class="flex justify-center items-center h-96">
            <div class="text-center">
              <div
                class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"
              ></div>
              <p class="text-lg text-gray-600 font-medium">Loading expedient...</p>
            </div>
          </div>
        } @else if (expedient(); as exp) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Sidebar - Expedient Information -->
            <aside class="lg:col-span-1">
              <div
                class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                  <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <span>📋</span> Expedient Information
                  </h3>
                </div>

                <div class="px-6 py-6 space-y-6">
                  <div>
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Case Number
                    </p>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      {{ exp.case_number }}
                    </p>
                  </div>

                  <div>
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Client
                    </p>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      {{ exp.client_name }}
                    </p>
                  </div>

                  @if (exp.assigned_lawyer) {
                    <div>
                      <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Assigned Lawyer
                      </p>
                      <p class="mt-1 text-sm font-medium text-gray-900">
                        {{ exp.assigned_lawyer }}
                      </p>
                    </div>
                  }

                  <div>
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Status
                    </p>
                    <p
                      [class]="
                        'mt-1 text-sm font-medium inline-block px-3 py-1 rounded ' +
                        getStatusClass(exp.status)
                      "
                    >
                      {{ exp.status }}
                    </p>
                  </div>

                  @if (exp.opening_date) {
                    <div>
                      <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Opening Date
                      </p>
                      <p class="mt-1 text-sm font-medium text-gray-900">
                        {{ formatDate(exp.opening_date) }}
                      </p>
                    </div>
                  }

                  @if (exp.closing_date) {
                    <div>
                      <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Closing Date
                      </p>
                      <p class="mt-1 text-sm font-medium text-gray-900">
                        {{ formatDate(exp.closing_date) }}
                      </p>
                    </div>
                  }

                  @if (exp.description) {
                    <div>
                      <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Description
                      </p>
                      <p class="mt-1 text-sm text-gray-700">{{ exp.description }}</p>
                    </div>
                  }

                  <!-- Improved Statistics -->
                  <div class="pt-6 border-t-2 border-gray-200 mt-8">
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                      Summary
                    </p>
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 text-center border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      >
                        <div class="text-3xl font-bold text-blue-600 mb-2">
                          {{ exp.document_sets.length }}
                        </div>
                        <p class="text-xs font-semibold text-gray-700">
                          Set{{ exp.document_sets.length !== 1 ? 's' : '' }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">📁</p>
                      </div>
                      <div
                        class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-5 text-center border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                      >
                        <div class="text-3xl font-bold text-emerald-600 mb-2">
                          {{ getTotalFiles(exp) }}
                        </div>
                        <p class="text-xs font-semibold text-gray-700">
                          File{{ getTotalFiles(exp) !== 1 ? 's' : '' }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">📄</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <!-- Main content - Upload and Documents -->
            <section class="lg:col-span-2">
              <div class="space-y-8">
                <!-- Upload form -->
                <app-file-upload [expedientId]="exp.id" (uploadSuccess)="onUploadSuccess()" />

                <!-- Documents section with list -->
                <app-document-sets-section
                  [documentSets]="exp.document_sets"
                  [expedientId]="exp.id"
                  (documentsRefresh)="onUploadSuccess()"
                />
              </div>
            </section>
          </div>
        } @else {
          <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div class="text-center py-16">
              <span class="text-6xl mb-4 inline-block opacity-50">⚠️</span>
              <p class="text-xl font-bold text-gray-900">Expedient not found</p>
              <p class="text-gray-600 mt-2">
                The expedient you are looking for does not exist or was deleted
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FileUploadComponent, DocumentSetsSectionComponent],
  styles: [],
})
export class ExpedientDetailComponent implements OnInit {
  protected readonly expedient = signal<Expediente | null>(null);
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

  getTotalFiles(expediente: Expediente): number {
    return expediente.document_sets.reduce((sum, set) => sum + set.files.length, 0);
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
