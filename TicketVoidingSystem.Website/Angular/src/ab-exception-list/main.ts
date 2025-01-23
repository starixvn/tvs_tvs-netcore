import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { AppComponent } from './app/app.component';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        importProvidersFrom(
            BrowserAnimationsModule, // Required for animations
            ToastrModule.forRoot({
              timeOut: 3000, // Global default for toast duration
              positionClass: 'toast-top-right', // Default position
              preventDuplicates: true, // Prevent duplicate toasts
            })
          ),

    ]
}).catch((err) => console.error(err));
