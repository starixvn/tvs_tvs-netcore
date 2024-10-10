import { AffectedTicketComponent } from './affected-ticket.component';
import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { MultipleSelectionComponent } from '../../../../utility/components/multiple-selection/multiple-selection.component';
import { TicketsComponent } from '../pool-house-ticket/tickets/tickets.component';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { GroupModel } from '../pool-house-ticket/tickets/group-tickets.model';

describe('AffectedTicketComponent', () => {
  @NgModule({
    declarations: [
      MultipleSelectionComponent,
      TicketsComponent
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

  it('#updateSelectedBetTypes update data expected', async () => {
    const { instance } = await shallow.render();
    let group1 = { tickets: [{groupBetTypeId: 1}], displayTotalTickets: 1} as GroupModel;
    let group2 = { tickets: [{groupBetTypeId: 2}], displayTotalTickets: 1} as GroupModel;

    let expectedGroup1 = { tickets: [{groupBetTypeId: 1, isChecked: true, no: 1}], displayTotalTickets: 1, isCheckAll: true} as GroupModel;
    let expectedGroup2 = { tickets: [{groupBetTypeId: 2, isChecked: false, no: 0}], displayTotalTickets: 1, isCheckAll: true} as GroupModel;

    instance.model.tickets = new TicketsModel();
    instance.model.tickets.groups = [group1, group2];
    instance.updateSelectedBetTypes(["1"]);
    expect(instance.model.tickets.groups[0]).toEqual(expectedGroup1);
    expect(instance.model.tickets.groups[1]).toEqual(expectedGroup2);
  });
});
