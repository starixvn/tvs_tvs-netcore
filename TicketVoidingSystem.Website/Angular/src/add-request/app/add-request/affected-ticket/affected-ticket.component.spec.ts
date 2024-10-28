import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { MultipleSelectionComponent } from '../../../../utility/components/multiple-selection/multiple-selection.component';
import { TicketsComponent } from '../pool-house-ticket/tickets/tickets.component';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { LogAnalysisService } from '../services/log-analysis.service';
import { AffectedTicketComponent } from './affected-ticket.component';
import { AffectedTicketService } from './affected-ticket.service';

describe('AffectedTicketComponent', () => {
  @NgModule({
    declarations: [
      MultipleSelectionComponent,
      TicketsComponent
    ],
    providers: [
      LogAnalysisService,
      AffectedTicketService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AffectedTicketComponent>;

  beforeEach(() => {
    shallow = new Shallow(AffectedTicketComponent, AppModuleTest);
  });
  
  it('#closeClick update data expected', async () => {
    const { instance } = await shallow.render();
    instance.closeClick();
    expect(instance.isCollapsed).toBeFalsy();
    expect(instance.model.isOpen).toBeFalsy();
  });

  it('#updateSelectedBetTypes call #checkTicketByBetTypesForLGEarlyPopup', async () => {
    const { instance } = await shallow.render();
    instance.tickets = new TicketsModel();
    instance.tickets.checkTicketByBetTypesForLGEarlyPopup = jest.fn();

    instance.updateSelectedBetTypes(["1"]);

    expect(instance.tickets.checkTicketByBetTypesForLGEarlyPopup).toHaveBeenCalledTimes(1);
  });
});
