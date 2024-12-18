import { NgModule, SimpleChange } from '@angular/core';
import { Shallow } from 'shallow-render';
import { MultipleSelectionComponent } from '../../../../utility/components/multiple-selection/multiple-selection.component';
import { TicketsComponent } from '../pool-house-ticket/tickets/tickets.component';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { LogAnalysisService } from '../services/log-analysis.service';
import { AffectedTicketComponent } from './affected-ticket.component';
import { AffectedTicketService } from './affected-ticket.service';
import { AffectedTicketsModel } from '../models/live-game-early-ticket.model';
import { GroupModel } from '../pool-house-ticket/tickets/group-tickets.model';

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

  it('#ngOnChanges should call getAffectedTickets when has change model', async () => {
      // Arrange
      const groupTickets = [{name: 'Single', tickets: []}] as GroupModel[];
      const otherGroupTickets = [{name: 'Other', tickets: []}] as GroupModel[];
      const tickets = {groups: groupTickets, groupOtherTickets: otherGroupTickets} as TicketsModel;
      const { instance } = await shallow
      .mock(LogAnalysisService, {writeLogClickLiveGameDetails: jest.fn()})
      .mock(AffectedTicketService, {getAffectedTickets: jest.fn().mockReturnValue(tickets)})
      .render();
      instance.model.isOpen = true;
      const model = {issueTypeId: 23, logInfoTicketsJson: '', isOpen: true} as AffectedTicketsModel;
      const changes = {'model': new SimpleChange(null, model, true)};
  
      // Action
      await instance.ngOnChanges(changes);
  
      // Assert
      expect(instance.tickets.groups).toEqual(tickets.groups);
      expect(instance.otherTickets.groups).toEqual(tickets.groupOtherTickets);
      expect(instance.blockBetList).toBeFalsy();
  });

  it('#closeClick update data expected', async () => {
    const { instance } = await shallow.render();
    instance.closeClick();
    expect(instance.isShowAffectedTickets).toBeTruthy();
    expect(instance.isShowGroupBetTypesCount).toBeTruthy();
    expect(instance.isShowOtherTickets).toBeTruthy();
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
