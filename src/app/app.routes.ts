import { Routes } from '@angular/router';
import { ExpedienteDetailComponent } from './components/expediente-detail/expediente-detail.component';
import { Dashboard } from './components/dashboard/dashboard';
import { Expedientes } from './components/expedientes/expedientes';
import { Documentos } from './components/documentos/documentos';
import { Configuracion } from './components/configuracion/configuracion';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'expedientes',
    component: Expedientes,
  },
  {
    path: 'documentos',
    component: Documentos,
  },
  {
    path: 'configuracion',
    component: Configuracion,
  },
  {
    path: 'expediente/:id',
    component: ExpedienteDetailComponent,
  },
];
