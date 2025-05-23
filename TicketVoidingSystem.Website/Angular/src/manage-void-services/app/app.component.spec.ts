import { NgModule } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { AppApiService } from './app-api.service';

class Helper {}

describe('AppComponent', () => {
  @NgModule({
    declarations: [
    ],
    providers: [HttpService, AppApiService]
  })
  class AppModuleTest { }


  beforeEach(() => {
  });
});
