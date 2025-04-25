import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { TicketCountOtherSportsComponent } from './ticket-count-other-sports.component';
import { StaticService } from '../../../../utility/services/static.service';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';

describe('TicketCountOtherSportsComponent', () => {
  let component: TicketCountOtherSportsComponent;
  let fixture: ComponentFixture<TicketCountOtherSportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCountOtherSportsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickOpenTicketDetails', () => {
    it('should emit openTicketDetails event', () => {
      // Arrange
      component.openTicketDetails.emit = jest.fn();

      // Act
      component.clickOpenTicketDetails();

      // Assert
      expect(component.openTicketDetails.emit).toHaveBeenCalled();
    });
  });

  describe('isShowCountInfo', () => {
    it('should call StaticService.isShowCountInfo with correct parameters', () => {
      // Arrange
      const cashOutCount = 1;
      const settleCount = 2;
      const instantlySettleCount = 3;
      StaticService.isShowCountInfo = jest.fn().mockReturnValue(true);

      // Act
      const result = component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

      // Assert
      expect(StaticService.isShowCountInfo).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
      expect(result).toBeTruthy();
    });
  });

  describe('countInfoContent', () => {
    it('should call StaticService.countInfoContent with correct parameters', () => {
      // Arrange
      const cashOutCount = 1;
      const settleCount = 2;
      const instantlySettleCount = 3;
      const expectedContent = 'Test Content';
      StaticService.countInfoContent = jest.fn().mockReturnValue(expectedContent);

      // Act
      const result = component.countInfoContent(cashOutCount, settleCount, instantlySettleCount);

      // Assert
      expect(StaticService.countInfoContent).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
      expect(result).toBe(expectedContent);
    });
  });

  describe('Input Properties', () => {
    it('should accept isVoided input', () => {
      // Arrange
      const isVoided = true;

      // Act
      component.isVoided = isVoided;

      // Assert
      expect(component.isVoided).toBe(isVoided);
    });

    it('should accept logInfoDetail input', () => {
      // Arrange
      const logInfoDetail = new LogInfoDetail();

      // Act
      component.logInfoDetail = logInfoDetail;

      // Assert
      expect(component.logInfoDetail).toBe(logInfoDetail);
    });
  });
});
