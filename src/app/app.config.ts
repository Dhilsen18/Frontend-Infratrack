import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../environments/environment';
import { IAM_REPOSITORY } from './iam/domain/ports/iam.repository';
import { FakeIamRepository } from './iam/infrastructure/fake-iam.repository';
import { HttpIamRepository } from './iam/infrastructure/http-iam.repository';
import { routes } from './app.routes';

const iamRepositoryImpl = environment.useFirebaseIam ? HttpIamRepository : FakeIamRepository;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: IAM_REPOSITORY, useClass: iamRepositoryImpl },
    provideRouter(routes),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en',
      lang: 'en',
    }),
  ],
};
