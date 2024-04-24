import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import {routerConfig, routes} from './app.routes';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {httpInterceptor} from "./helpers/http.interceptor";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withRouterConfig(routerConfig)), importProvidersFrom(HttpClientModule), provideHttpClient(withInterceptors([httpInterceptor])), provideAnimationsAsync()]
};
