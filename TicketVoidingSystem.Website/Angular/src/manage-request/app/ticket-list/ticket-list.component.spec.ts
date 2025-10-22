import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestDetailViewModel } from '../../../add-request-new/models/request-detail.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { CommonService } from '../../../utility/services/common.service';
import { TicketListComponent } from './ticket-list.component';
import { TicketListModal } from './ticket-list.modal';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        CommonService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketListComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;
  });

  it('#ngOnChanges should getRequestById when model is open', async () => {
    // Arrange
    const requestDetail = { requestId: 7586, request: { issueTypeId: 1 }, dangerAcceptedModels: [{ isMainMatch: true, subIssueTypeId: 3 }] } as RequestDetailViewModel;
    commonService.getRequestById = jest.fn().mockResolvedValue(requestDetail);
    component.modal = { open: true } as TicketListModal;

    // Action
    await component.ngOnChanges();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(component.requestDetail).toEqual(requestDetail);
    expect(component.isShowRequestInfo).toBeTruthy();
  });

  it('#ngOnChanges should not getRequestById & IssueInfo when model not open', async () => {
    // Arrange
    const mockGetRequestById = jest.fn();
    const mockGetIssueInfo = jest.fn();
    commonService.getRequestById = mockGetRequestById;
    commonService.getIssueInfo = mockGetIssueInfo;
    component.modal = { open: false } as TicketListModal;

    // Action
    await component.ngOnChanges();

    // Assert
    expect(mockGetRequestById).toHaveBeenCalledTimes(0);
    expect(mockGetIssueInfo).toHaveBeenCalledTimes(0);
  });
});
