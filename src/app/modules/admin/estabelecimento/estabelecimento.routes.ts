import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { EstabelecimentoComponent } from './estabelecimento.component';
import { ItensAgrupadosComponent } from '@shared/components/itens-agrupados/itens-agrupados.component';

export const DASHBOARD_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'estabelecimento',
    pathMatch: 'full',
  },
  {
    path: 'cadastro',
    component: CadastroComponent,
  },
  {
    path: 'estabelecimento',
    component: EstabelecimentoComponent,
  },
  {
    path: 'itens-agrupados',
    component: ItensAgrupadosComponent,
  },
  { path: '**', component: Page404Component },
];
