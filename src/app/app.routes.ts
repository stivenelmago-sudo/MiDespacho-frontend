import { Routes } from '@angular/router';
import { ExpedienteDetailComponent } from './components/expediente-detail/expediente-detail.component';

export const routes: Routes = [
  {
    path: 'expediente/:id',
    component: ExpedienteDetailComponent,
  },
  {
    path: '',
    redirectTo: '/expediente/default-id',
    pathMatch: 'full',
  },
];
