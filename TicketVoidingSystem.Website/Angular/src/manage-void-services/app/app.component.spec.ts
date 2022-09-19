import { ToolTipModule } from '../../utility/modules/tooltip/tooltip.module';
import { AppService } from './app.service';
import { NgModule } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import * as _ from 'lodash';

class Helper {}

describe('AppComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      ToolTipModule
    ],
    providers: [HttpService, AppService]
  })
  class AppModuleTest { }


  beforeEach(() => {
  });
});
