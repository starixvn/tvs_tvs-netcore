import { NgModule } from '@angular/core';
import { ToolTipModule } from '../../utility/modules/tooltip/tooltip.module';
import { HttpService } from '../../utility/services/http.service';
import { AppApiService } from './app-api.service';

class Helper {}

describe('AppComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      ToolTipModule
    ],
    providers: [HttpService, AppApiService]
  })
  class AppModuleTest { }


  beforeEach(() => {
  });
});
