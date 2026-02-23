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
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- Header con gradient mejorado -->
      <div
        class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg border-b border-blue-900"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          @if (expediente(); as exp) {
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-4 mb-3">
                  <div class="p-3 bg-blue-500 rounded-lg shadow-lg">
                    <span class="text-2xl">⚖️</span>
                  </div>
                  <div>
                    <h1 class="text-4xl font-bold text-white">{{ exp.cliente_nombre }}</h1>
                    <p class="text-blue-200 mt-2 text-lg">
                      Expediente #{{ exp.numero_expediente }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div
                  [class]="
                    'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-md ' +
                    getStatusClass(exp.estado)
                  "
                >
                  <span
                    class="w-2 h-2 rounded-full inline-block"
                    [class]="getStatusDot(exp.estado)"
                  ></span>
                  {{ exp.estado }}
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
              <p class="text-lg text-gray-600 font-medium">Cargando expediente...</p>
            </div>
          </div>
        } @else if (expediente(); as exp) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Sidebar - Información del expediente -->
            <aside class="lg:col-span-1">
              <div
                class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                  <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <span>📋</span> Información del Expediente
                  </h3>
                </div>

                <div class="px-6 py-6 space-y-6">
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

                  <!-- Estadísticas mejoradas -->
                  <div class="pt-6 border-t-2 border-gray-200 mt-8">
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                      Resumen
                    </p>
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 text-center border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      >
                        <div class="text-3xl font-bold text-blue-600 mb-2">
                          {{ exp.document_sets.length }}
                        </div>
                        <p class="text-xs font-semibold text-gray-700">
                          Conjunto{{ exp.document_sets.length !== 1 ? 's' : '' }}
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
                          Archivo{{ getTotalFiles(exp) !== 1 ? 's' : '' }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">📄</p>
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
          <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div class="text-center py-16">
              <span class="text-6xl mb-4 inline-block opacity-50">⚠️</span>
              <p class="text-xl font-bold text-gray-900">No se encontró el expediente</p>
              <p class="text-gray-600 mt-2">El expediente que buscas no existe o fue eliminado</p>
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

  getStatusDot(estado: string): string {
    const classes: Record<string, string> = {
      Activo: 'bg-green-500',
      Cerrado: 'bg-gray-500',
      'En Revisión': 'bg-yellow-500',
      Suspendido: 'bg-red-500',
    };
    return classes[estado] || 'bg-gray-500';
  }
}
