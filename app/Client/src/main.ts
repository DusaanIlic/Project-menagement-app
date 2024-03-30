import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter, withDebugTracing } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withDebugTracing()),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(MatDialogModule),
    provideAnimations(),
  ],
}).catch((err: any) => console.error(err));
