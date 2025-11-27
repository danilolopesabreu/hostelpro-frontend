import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { ProdutosComponent } from './produtos.component';


export const DASHBOARD_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'produto',
    pathMatch: 'full',
  },
  {
    path: 'produto',
    component: ProdutosComponent,
  },
  { path: '**', component: Page404Component },
];
