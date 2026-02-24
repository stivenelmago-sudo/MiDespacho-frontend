import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExpedientService } from '../../services/expedient.service';
import { Expedient } from '../../models/expedient.model';

@Component({
  selector: 'app-expedients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expedients.html',
  styleUrl: './expedients.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Expedients implements OnInit {
  protected expedients = signal<Expedient[]>([]);
  protected isLoading = signal(true);
  protected error = signal<string | null>(null);

  constructor(
    private readonly expedientService: ExpedientService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.loadExpedients();
  }

  private loadExpedients(): void {
    this.expedientService.getExpedients().subscribe({
      next: (data) => {
        this.expedients.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading expedients:', err);
        this.error.set('Error loading expedients');
        this.isLoading.set(false);
      },
    });
  }

  protected navigateToDetail(expedientId: string): void {
    this.router.navigate(['/expedient', expedientId]);
  }

  protected getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      Active: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
      'In Review': 'bg-yellow-100 text-yellow-800',
      Suspended: 'bg-red-100 text-red-800',
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }
}
