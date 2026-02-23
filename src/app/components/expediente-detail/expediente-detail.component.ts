import { Component, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Expediente } from '../../models/expediente.model';
import { ExpedienteService } from '../../services/expediente.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { DocumentSetsSectionComponent } from '../document-sets-section/document-sets-section.component';

@Component({
  selector: 'app-expediente-detail',
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <div class="bg-legal-blue-600 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          @if (expediente(); as exp) {
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-3xl font-bold">{{ exp.cliente_nombre }}</h1>
                <p class="text-legal-blue-200 mt-2">Expediente #{{ exp.numero_expediente }}</p>
              </div>
              <div class="text-right">
                <div
                  [class]="
                    'inline-block px-4 py-2 rounded-full text-sm font-medium ' +
                    getStatusClass(exp.estado)
                  "
                >
                  {{ exp.estado }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if (isLoading()) {
          <div class="flex justify-center items-center h-96">
            <div class="text-center">
              <div
                class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-legal-blue-600"
              ></div>
              <p class="mt-4 text-gray-600">Cargando expediente...</p>
            </div>
          </div>
        } @else if (expediente(); as exp) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Sidebar - Información del expediente -->
            <aside class="lg:col-span-1">
              <div class="card">
                <div class="card-header">
                  <h3>Información del Expediente</h3>
                </div>

                <div class="space-y-4">
                  <div>
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Número de Expediente
                    </p>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      {{ exp.numero_expediente }}
                    </p>
                  </div>

                  <div>
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Cliente
                    </p>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      {{ exp.cliente_nombre }}
                    </p>
                  </div>

                  @if (exp.abogado_asignado) {
                    <div>
                      <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Abogado Asignado
                      </p>
                      <p class="mt-1 text-sm font-medium text-gray-900">
                        {{ exp.abogado_asignado }}
                      </p>
                    </div>
                  }

                  <div>
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Estado
                    </p>
                    <p
                      [class]="
                        'mt-1 text-sm font-medium inline-block px-3 py-1 rounded ' +
                        getStatusClass(exp.estado)
                      "
                    >
                      {{ exp.estado }}
                    </p>
                  </div>

                  @if (exp.fecha_apertura) {
                    <div>
                      <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Fecha de Apertura
                      </p>
                      <p class="mt-1 text-sm font-medium text-gray-900">
                        {{ formatDate(exp.fecha_apertura) }}
                      </p>
                    </div>
                  }

                  @if (exp.fecha_cierre) {
                    <div>
                      <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Fecha de Cierre
                      </p>
                      <p class="mt-1 text-sm font-medium text-gray-900">
                        {{ formatDate(exp.fecha_cierre) }}
                      </p>
                    </div>
                  }

                  @if (exp.descripcion) {
                    <div>
                      <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Descripción
                      </p>
                      <p class="mt-1 text-sm text-gray-700">{{ exp.descripcion }}</p>
                    </div>
                  }

                  <!-- Estadísticas -->
                  <div class="pt-4 border-t border-gray-200 mt-6">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="text-center">
                        <p class="text-2xl font-bold text-legal-blue-600">
                          {{ exp.document_sets.length }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Conjuntos</p>
                      </div>
                      <div class="text-center">
                        <p class="text-2xl font-bold text-legal-blue-600">
                          {{ getTotalFiles(exp) }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Archivos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <!-- Main content - Upload y Documents -->
            <section class="lg:col-span-2">
              <div class="space-y-8">
                <!-- Upload form -->
                <app-file-upload [expedienteId]="exp.id" (uploadSuccess)="onUploadSuccess()" />

                <!-- Documents section with list -->
                <app-document-sets-section
                  [documentSets]="exp.document_sets"
                  [expedienteId]="exp.id"
                  (documentsRefresh)="onUploadSuccess()"
                />
              </div>
            </section>
          </div>
        } @else {
          <div class="card">
            <div class="text-center py-12">
              <p class="text-gray-600">No se encontró el expediente</p>
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
export class ExpedienteDetailComponent implements OnInit {
  protected readonly expediente = signal<Expediente | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  private expedienteId: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly expedienteService: ExpedienteService,
  ) {
    // Efecto para recargar expediente cuando sea necesario
    effect(() => {
      if (this.expedienteId) {
        this.loadExpediente();
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.expedienteId = params['id'];
      this.loadExpediente();
    });
  }

  private loadExpediente(): void {
    this.isLoading.set(true);
    this.expedienteService.getExpediente(this.expedienteId).subscribe({
      next: (data) => {
        this.expediente.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading expediente:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Error al cargar el expediente');
      },
    });
  }

  onUploadSuccess(): void {
    this.loadExpediente();
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

  getStatusClass(estado: string): string {
    const classes: Record<string, string> = {
      Activo: 'bg-green-100 text-green-800',
      Cerrado: 'bg-gray-100 text-gray-800',
      'En Revisión': 'bg-yellow-100 text-yellow-800',
      Suspendido: 'bg-red-100 text-red-800',
    };
    return classes[estado] || 'bg-gray-100 text-gray-800';
  }
}
