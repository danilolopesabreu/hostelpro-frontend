import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { VenderComponent } from './vender/vender.component';
import { RealizadasComponent } from './realizadas/realizadas.component';

export const DASHBOARD_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'vender',
    pathMatch: 'full',
  },
  {
    path: 'vender',
    component: VenderComponent,
  },
  {
    path: 'realizadas',
    component: RealizadasComponent,
  },
  { path: '**', component: Page404Component },
];
