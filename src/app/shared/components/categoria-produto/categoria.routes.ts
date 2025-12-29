import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { CategoriaProdutoComponent } from './categoria-produto.component';



export const DASHBOARD_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'categoria',
    pathMatch: 'full',
  },
  {
    path: 'categoria',
    component: CategoriaProdutoComponent,
  },
  { path: '**', component: Page404Component },
];
