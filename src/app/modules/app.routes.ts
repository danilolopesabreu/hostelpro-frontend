import { Route } from '@angular/router';
import { AdminLayoutComponent } from '@layout/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { AuthGuardLocal } from '@core/guard/auth.guard';
import { Page403Component } from './sessions/page403/page403.component';
import { Page404Component } from './sessions/page404/page404.component';
import { Page500Component } from './sessions/page500/page500.component';
import { Role } from '@core/models/role';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuardLocal],
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      {
        path: 'vendas',
        canActivate: [AuthGuardLocal],
        loadChildren: () =>
          import('../modules/admin/vendas/vendas.routes').then(
            (m) => m.DASHBOARD_ROUTE
          ),
        data: {
          role: [Role.Admin],
        },
      },
      {
        path: 'estabelecimento',
        canActivate: [AuthGuardLocal],
        loadChildren: () =>
          import('../modules/admin/estabelecimento/estabelecimento.routes').then(
            (m) => m.DASHBOARD_ROUTE
          ),
        data: {
          role: [Role.Admin],
        },
      },
      {
        path: 'produtos',
        canActivate: [AuthGuardLocal],
        loadChildren: () =>
          import('../modules/admin/produtos/produtos.routes').then(
            (m) => m.DASHBOARD_ROUTE
          ),
        data: {
          role: [Role.Admin],
        },
      },
      // Admin menu start
      {
        path: 'dashboard',
        canActivate: [AuthGuardLocal],
        loadChildren: () =>
          import('../modules/admin/dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTE
          ),
        data: {
          role: [Role.Admin],
        },
      },
      // Admin menu end
      // employee menu start
      {
        path: 'emp_dashboard',
        canActivate: [AuthGuardLocal],
        loadChildren: () =>
          import('../modules/employee/dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTE
          ),
        data: {
          role: [Role.Admin, Role.Employee],
        },
      },
      // employee menu end
      {
        path: 'utilities',
        loadChildren: () =>
          import('./utilities/utilities.routes').then((m) => m.UTILITIES_ROUTE),
        data: {
          role: [Role.Admin],
        },
      },
      {
        path: '403',
        component: Page403Component,
      },
      {
        path: '404',
        component: Page404Component,
      },
      {
        path: '500',
        component: Page500Component,
      },
    ],
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./sessions/sessions.routes').then((m) => m.SESSION_ROUTE),
  },
  { path: '**', redirectTo: '404' },
];
