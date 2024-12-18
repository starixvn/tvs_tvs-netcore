import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { BlockUiModule } from '../../../utility/components/block-ui/block-ui.module';
import { IssueInfo } from '../../../utility/models/issue-type.model';
import { CommonService } from '../../../utility/services/common.service';
import { HttpService } from '../../../utility/services/http.service';
import { MatchInfoComponent } from './match-info/match-info.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { TicketListComponent } from './ticket-list.component';
import { TicketListModal } from './ticket-list.modal';
import { TicketsComponent } from './tickets/tickets.component';

describe('TicketListComponent', () => {
  @NgModule({
    declarations: [
      MatchInfoComponent,
      RequestInfoComponent,
      TicketsComponent
    ],
    imports: [
      BlockUiModule
    ],
    providers: [
      HttpService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<TicketListComponent>;
  let modal = {requestId: 1, open: false} as TicketListModal;
  let requestDetail = {request: {issueTypeId: 1} as RequestDetailModel, 
    dangerAcceptedModels: [{isMainMatch: true,subIssueTypeId: 1 }]} as RequestDetailViewModel;
  let issue = new IssueInfo();
  beforeEach(() => {
    shallow = new Shallow(TicketListComponent, AppModuleTest);
  });

  it('#ngOnChanges should call expected function', async () => {
    // Arrange
    const mockGetRequestById = jest.fn().mockImplementation(() => requestDetail);
    const mockGetIssueInfo = jest.fn().mockImplementation(() => issue);
    
    const { instance } = await shallow
      .mock(CommonService, {
        getRequestById: mockGetRequestById,
        getIssueInfo: mockGetIssueInfo
      })
      .render({
        bind: {
          modal: modal
        }
      });
    modal.open = true;

    // Action
    await instance.ngOnChanges();

    // Assert
    expect(mockGetRequestById).toHaveBeenCalled();
    expect(mockGetIssueInfo).toHaveBeenCalled();
  });

  it('#ngOnChanges should not call updateTabInfoRequest when model not open', async () => {
    // Arrange
    const mockFunctionUpdateTabInfoRequest = jest.fn();
    const { instance } = await shallow
      .render({
        bind: {
          modal: modal
        }
      });
      instance.modal.open = false;
      instance['updateTabInfoRequest'] = mockFunctionUpdateTabInfoRequest;

    // Action
    await instance.ngOnChanges();

    // Assert
    expect(mockFunctionUpdateTabInfoRequest).toHaveBeenCalledTimes(0);
  });
});
