import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoOtherIssuesComponent } from './log-info-other-issues.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { AffectedTicketService } from '../../affected-ticket/affected-ticket.service';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';

class Helper {
  static readonly fakeLogInfo: LogInfoOtherIssues = {
    logInfoDetail: null,
    messageValidationLogInfo: null
  } as LogInfoOtherIssues;

  static readonly fakePrimitiveProps: PrimitiveProperty = {
    isShowValidation: false
  } as PrimitiveProperty;
}

describe('LogInfoOtherIssuesComponent', () => {
  let component: LogInfoOtherIssuesComponent;
  let fixture: ComponentFixture<LogInfoOtherIssuesComponent>;
  let modalService: ModalService;
  let staticService: StaticService;
  let affectedTicketService: AffectedTicketService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ModalService,
        StaticService,
        AffectedTicketService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoOtherIssuesComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    staticService = fixture.debugElement.injector.get(StaticService);
    affectedTicketService = fixture.debugElement.injector.get(AffectedTicketService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with validation when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.primitiveProps = Helper.fakePrimitiveProps;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.primitiveProps.isShowValidation).toBeTruthy();
  });

  it('should not initialize validation when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    component.primitiveProps = {
      isShowValidation: false
    } as PrimitiveProperty;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.primitiveProps.isShowValidation).toBeFalsy();
  });

  it('should display full date time format correctly', () => {
    // Arrange
    const testDate = new Date('2024-03-20T10:30:00');

    // Act
    const result = component.displayFullDateTimeFormat(testDate);

    // Assert
    expect(result).toBe(moment(testDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT));
  });

  it('should clear data validation', () => {
    // Arrange
    component.logInfo = Helper.fakeLogInfo;

    // Act
    component.clearDataValidation();

    // Assert
    expect(component.logInfo.logInfoDetail).toBeNull();
    expect(component.logInfo.messageValidationLogInfo).toBeNull();
  });

  it('should open popup trans ids', () => {
    // Arrange
    const requestId = 123;
    const transIds = 'ABC123';
    jest.spyOn(StaticService, 'openPopupTransIds');

    // Act
    component.openPopupTransIds(requestId, transIds);

    // Assert
    expect(StaticService.openPopupTransIds).toHaveBeenCalledWith(requestId, transIds, modalService);
  });

  it('should count info content correctly', () => {
    // Arrange
    const cashOutCount = 2;
    const settleCount = 3;
    const instantlySettleCount = 1;
    jest.spyOn(StaticService, 'countInfoContent');

    // Act
    component.countInfoContent(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(StaticService.countInfoContent).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
  });

  it('should display trans id correctly when ticket count is 0', () => {
    // Act
    const result = component.displayTransId(0, 'ABC123');

    // Assert
    expect(result).toBe('-');
  });

  it('should display trans id correctly when ticket count is greater than 0', () => {
    // Act
    const result = component.displayTransId(1, 'ABC123');

    // Assert
    expect(result).toBe('ABC123');
  });

  it('should check if show count info', () => {
    // Arrange
    const cashOutCount = 2;
    const settleCount = 3;
    const instantlySettleCount = 1;
    jest.spyOn(StaticService, 'isShowCountInfo');

    // Act
    component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(StaticService.isShowCountInfo).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
  });

  it('should show affected tickets details', () => {
    // Arrange
    component.logInfo = {
      logInfoDetail: {
        logInfoTicketsJson: '{"tickets": []}'
      }
    } as LogInfoOtherIssues;
    component.issueTypeId = '1';
    const expectedModel = new AffectedTicketsModel();
    expectedModel.logInfoTicketsJson = '{"tickets": []}';
    expectedModel.issueTypeId = 1;
    expectedModel.isOpen = true;

    // Act
    component.showAffectedTicketsDetails();

    // Assert
    expect(component.affectedTicketsModel.logInfoTicketsJson).toBe(expectedModel.logInfoTicketsJson);
    expect(component.affectedTicketsModel.issueTypeId).toBe(expectedModel.issueTypeId);
    expect(component.affectedTicketsModel.isOpen).toBe(expectedModel.isOpen);
  });
});
