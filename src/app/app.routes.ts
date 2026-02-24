import { Routes } from '@angular/router';
import { ExpedientDetailComponent } from './components/expedient-detail/expedient-detail.component';
import { Dashboard } from './components/dashboard/dashboard';
import { Expedients } from './components/expedients/expedients';
import { Documents } from './components/documents/documents';
import { Configuration } from './components/configuration/configuration';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'expedients',
    component: Expedients,
  },
  {
    path: 'documents',
    component: Documents,
  },
  {
    path: 'configuration',
    component: Configuration,
  },
  {
    path: 'expedient/:id',
    component: ExpedientDetailComponent,
  },
];
