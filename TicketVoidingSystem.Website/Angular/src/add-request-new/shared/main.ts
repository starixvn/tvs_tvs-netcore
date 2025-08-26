import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../../environments/environment';

// This will be dynamically imported based on the event type
// Each event should export its AppComponent
export async function bootstrapEvent(AppComponent: any) {
  if (environment.production) {
    enableProdMode();
  }

  return bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(),
      importProvidersFrom(
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ),
    ]
  }).catch((err) => console.error(err));
}