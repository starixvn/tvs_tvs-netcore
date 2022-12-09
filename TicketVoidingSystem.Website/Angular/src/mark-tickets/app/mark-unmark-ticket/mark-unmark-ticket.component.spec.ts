import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BaseTicketsListComponent } from '../../../utility/components/base-tickets-list/base-tickets-list.component';
import { MatchDetailComponent } from '../../../utility/components/match-detail/match-detail.component';
import { ModalService } from '../../../utility/modules/modal/modal.service';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { AllMarkedTicketListComponent } from './all-marked-ticket-list/all-marked-ticket-list.component';
import { FilterTicketsComponent } from './filter-tickets/filter-tickets.component';
import { MarkUnmarkTicketComponent } from './mark-unmark-ticket.component';

describe('MarkUnmarkTicketComponent', () => { 
  @NgModule({
    declarations: [
      MarkUnmarkTicketComponent,
      FilterTicketsComponent,    
      AllMarkedTicketListComponent,
      MatchDetailComponent,
      BaseTicketsListComponent,
      TicketsListComponent
    ],
    imports: [
      FormsModule,
      NgbModule
    ],
  })
  class AppModuleTest { }

  let shallow: Shallow<MarkUnmarkTicketComponent>;

  beforeEach(() => {
    shallow = new Shallow(MarkUnmarkTicketComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(AppService, {})
      .mock(CommonService, {})
      .mock(ModalService, {});
  });

  it('#MarkUnmarkTicketComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render();

    expect(fixture).toMatchSnapshot();
  });
});