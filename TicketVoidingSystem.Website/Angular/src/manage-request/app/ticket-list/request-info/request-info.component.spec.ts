import { SimpleChange } from '@angular/core';
import { IssueInfo } from '../../../../utility/models/issue-type.model';
import { RequestInfoComponent } from './request-info.component';
import { TicketListModal } from '../ticket-list.modal';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { GeneralInfo, GeneralInfoViewModel } from './request-info.model';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { TicketsModel } from '../tickets/tickets.model';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';

describe('RequestInfoComponent', () => {  
  let fakeTicketListModal = {matchId: 1} as TicketListModal;
  let fakeGeneralInfoViewModel = 
    {generalInfoModel: {voidingHistoryIds: "2", singleTransIds: "1, 2", recoveredTimeString: ""} as GeneralInfo} as GeneralInfoViewModel;
  let fakeModel = {request: {issueTypeId: 1}, abnormalBetModel: {filterBy: 1}, duplicateTicketsModel: {filterBy: 1}} as RequestDetailViewModel;
  let fakeIssue = { name: 'Abnormal', subIssueTypeId: 27, issueTypeId: 11,
    subIssueTypeName: 'Abnormal', subIssueTypeNameCS: '非正常' } as IssueInfo;
  let config = new NgbAccordionConfig(null);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('#ngOnInit should setting data expected', async () => {
    // Arrange
    let component = new RequestInfoComponent(null, null, config);
    const fakeFunctionGetDataCurrentTab = jest.fn();
    component['getDataCurrentTab'] = fakeFunctionGetDataCurrentTab;
    const dataTests = [{selectedMatchId: 1, activeTab: "1"}, {selectedMatchId: null, activeTab: "0"}];
    component.ticketListModal = fakeTicketListModal;
    
    // Action and Assert
    dataTests.forEach(x => {
      component.selectedMatchId = x.selectedMatchId;
      component.ngOnInit();
      expect(fakeFunctionGetDataCurrentTab).toBeCalled();
      expect(component.paging.pageSize).toBe(500);
      expect(component.activeTab).toBe(x.activeTab);
    })
  });

  it('#ngOnChanges should call updateIssue when has change IssueInfo ', () => {
    // Arrange
    let component = new RequestInfoComponent(null, null, config);
    component.issue = fakeIssue;
    const changes = {
      'issue': new SimpleChange(new IssueInfo(), fakeIssue, true),
    };
    const fakeFunctionUpdateIssue = jest.fn();
    component['updateIssue'] = fakeFunctionUpdateIssue

    // Action and Assert
    component.ngOnChanges(changes);
    expect(fakeFunctionUpdateIssue).toHaveBeenCalled();
  });

  it('#ngOnChanges should not call updateIssue when has not change IssueInfo ', () => {
    // Arrange
    let component = new RequestInfoComponent(null, null, config);
    const fakeFunctionUpdateIssue = jest.fn();
    component.issue = fakeIssue;
    const changes = {
      'issue': new SimpleChange(fakeIssue, fakeIssue, false),
    };
    component['updateIssue']
    // Action
    component.ngOnChanges(changes);

    // Assert
    expect(fakeFunctionUpdateIssue).toBeCalledTimes(0);
  });

  it('#getTickets should has getTickets', async () => {
    // Arrange
    let appService = new AppService(null)
    let tickets = {totalTicketsProcessed: 1} as TicketsModel;
    appService.getVoidedTickets = jest.fn().mockReturnValue(tickets);
    let component = new RequestInfoComponent(appService, null, config);
    component.ticketListModal = fakeTicketListModal;
    component.generalInfoViewModel = fakeGeneralInfoViewModel;
    component.model = fakeModel;
    component.paging = new PagingModel();

    // Action
    await component.getTickets(12);

    // Assert
    expect(component.tickets).toEqual(tickets);
    expect(component.paging.total).toBe(1);
  });

  it('#pagingEvent should call getTickets', async () => {
    // Arrange
    let component = new RequestInfoComponent(null, null, config);
    const fakeFunctionGetTickets = jest.fn();
    component.getTickets = fakeFunctionGetTickets;
    component.ticketListModal = fakeTicketListModal;

    // Action
    await component.pagingEvent();

    // Assert
    expect(fakeFunctionGetTickets).toBeCalled();
  });

  it('#isShowMatchInfo should return false', () => {
    // Arrange
    let component = new RequestInfoComponent(null, null, config);
    let dataTests = [13, 11, 17, 20, 22];
    component.model = fakeModel;

    // Action & Assert
    dataTests.forEach(x => {
      component.issue.issueTypeId = x;
      const actual = component.isShowMatchInfo();
      expect(actual).toBeFalsy();
    })
  });
  
  it('#isShowMatchInfo should return true', () => {
    // Arrange
    let component = new RequestInfoComponent(null, null, config);
    component.issue.issueTypeId = 1;
    component.model = fakeModel;

    // Action
    const actual = component.isShowMatchInfo();

    // Assert
    expect(actual).toBeTruthy();
  });
});
