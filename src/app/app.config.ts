import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { APP_ROUTE } from './modules/app.routes';
import { appInitializerProviders, httpInterceptorProviders } from '@core';
import { AuthHttpInterceptor } from '@core/interceptor/auth-http-interceptor';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { ToastrModule } from 'ngx-toastr';
import { NgxPermissionsModule } from 'ngx-permissions';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { AppDirectionality } from '@shared';
import { Directionality } from '@angular/cdk/bidi';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTE),
    provideAnimations(),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    httpInterceptorProviders,
    provideHttpClient(
      withInterceptors([AuthHttpInterceptor])
    ),
    appInitializerProviders,
    importProvidersFrom(NgProgressHttpModule, NgProgressRouterModule),
    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'MM-DD-YYYY',
        },
        display: {
          dateInput: 'MM-DD-YYYY',
          monthYearLabel: 'YYYY MMM',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY MMM',
        },
      },
    },
    importProvidersFrom(FeatherModule.pick(allIcons)),
    importProvidersFrom(NgxPermissionsModule.forRoot()),
    importProvidersFrom(ToastrModule.forRoot()),
    provideCharts(withDefaultRegisterables()),
    provideAnimationsAsync(),
    AppDirectionality,
    {
      provide: Directionality,
      useExisting: AppDirectionality,
    },
  ],
};
