import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { SortingModule } from '../../../../../utility/components/sorting/sorting.module';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { ValidationService } from '../services/validation.service';
import { AccountTableComponent } from './account-table.component';

describe('AccountTableComponent', () => {
  @NgModule({
    imports: [
      FormsModule,
      NgbModule,
      SortingModule,
      ToolTipModule
    ],
    providers: [
      AddRequestStore,
      AddRequestApiService,
      ValidationService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AccountTableComponent>;

  beforeEach(() => {
    shallow = new Shallow(AccountTableComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('AccountTableComponent should init match snapshot', async () => {
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
