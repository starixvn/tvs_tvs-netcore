import { enableProdMode, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { AppComponent } from './app/app.component';

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