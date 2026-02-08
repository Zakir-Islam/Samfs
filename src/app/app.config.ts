import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { customInterceptor } from './Interceptors/custom.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideHttpClient(),
  importProvidersFrom(FontAwesomeModule),
  provideAnimations(),
  provideToastr({
    timeOut: 1000,
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true
  }),
  providePrimeNG({
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: 'none'
      }
    }
  }),
    MessageService
  ]
};
