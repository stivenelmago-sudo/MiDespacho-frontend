import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExpedienteService } from '../../services/expediente.service';
import { Expediente } from '../../models/expediente.model';

@Component({
  selector: 'app-expedientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expedientes.html',
  styleUrl: './expedientes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Expedientes implements OnInit {
  protected expedientes = signal<Expediente[]>([]);
  protected isLoading = signal(true);
  protected error = signal<string | null>(null);

  constructor(
    private readonly expedienteService: ExpedienteService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.loadExpedientes();
  }

  private loadExpedientes(): void {
    this.expedienteService.getExpedientes().subscribe({
      next: (data) => {
        this.expedientes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando expedientes:', err);
        this.error.set('Error al cargar expedientes');
        this.isLoading.set(false);
      },
    });
  }

  protected navigateToDetail(expedienteId: string): void {
    this.router.navigate(['/expediente', expedienteId]);
  }

  protected getStatusClass(estado: string): string {
    const classMap: Record<string, string> = {
      Activo: 'bg-green-100 text-green-800',
      Cerrado: 'bg-gray-100 text-gray-800',
      'En Revisión': 'bg-yellow-100 text-yellow-800',
      Suspendido: 'bg-red-100 text-red-800',
    };
    return classMap[estado] || 'bg-gray-100 text-gray-800';
  }
}
