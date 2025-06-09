import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { LogInfoTicketCountComponent } from './log-info-ticket-count.component';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../utility/constants/config';

describe('LogInfoTicketCountComponent', () => {
  let component: LogInfoTicketCountComponent;
  let fixture: ComponentFixture<LogInfoTicketCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoTicketCountComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display full date time format correctly', () => {
    // Arrange
    const testDate = new Date('2024-03-20T10:30:00');
    const expectedFormat = moment(testDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    // Act
    const result = component.displayFullDateTimeFormat(testDate);

    // Assert
    expect(result).toBe(expectedFormat);
  });

  it('should call StaticService.countInfoContent with correct parameters', () => {
    // Arrange
    const cashOutCount = 5;
    const settleCount = 3;
    const instantlySettleCount = 2;
    jest.spyOn(StaticService, 'countInfoContent').mockReturnValue('Test Content');

    // Act
    const result = component.countInfoContent(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(StaticService.countInfoContent).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
    expect(result).toBe('Test Content');
  });

  it('should call StaticService.isShowCountInfo with correct parameters', () => {
    // Arrange
    const cashOutCount = 5;
    const settleCount = 3;
    const instantlySettleCount = 2;
    jest.spyOn(StaticService, 'isShowCountInfo').mockReturnValue(true);

    // Act
    const result = component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

    // Assert
    expect(StaticService.isShowCountInfo).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
    expect(result).toBe(true);
  });

  it('should emit openAffectedDetails event when showAffectedTicketsDetails is called', () => {
    // Arrange
    const emitSpy = jest.spyOn(component.openAffectedDetails, 'emit');

    // Act
    component.showAffectedTicketsDetails();

    // Assert
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle input properties correctly', async () => {
    // Arrange
    const mockModel: LogInfoDetail = {
      cashOutCount: 0,
      settleCount: 0,
      instantlySettleCount: 0
    } as LogInfoDetail;
    const isShowCancelCashOut = true;
    const isShowDetailsButton = true;

    // Act
    component.model = mockModel;
    component.isShowCancelCashOut = isShowCancelCashOut;
    component.isShowDetailsButton = isShowDetailsButton;
    
    // Wait for async operations to complete
    await fixture.whenStable();

    // Assert
    expect(component.model).toBe(mockModel);
    expect(component.isShowCancelCashOut).toBe(isShowCancelCashOut);
    expect(component.isShowDetailsButton).toBe(isShowDetailsButton);
  });
});
