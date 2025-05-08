import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from '../environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        importProvidersFrom(
            BrowserAnimationsModule,
            ToastrModule.forRoot()
          ),

    ]
}).catch((err) => console.error(err));
