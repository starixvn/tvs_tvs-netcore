import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoNotParticipateComponent } from './log-info-not-participate.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';

describe('LogInfoNotParticipateComponent', () => {
  let component: LogInfoNotParticipateComponent;
  let fixture: ComponentFixture<LogInfoNotParticipateComponent>;
  let modalService: ModalService;
  let staticService: StaticService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ModalService,
        StaticService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoNotParticipateComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    staticService = fixture.debugElement.injector.get(StaticService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displayFullDateTimeFormat', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2024-03-20T10:30:00');
      const result = component.displayFullDateTimeFormat(testDate);
      expect(result).toBe(moment(testDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT));
    });
  });

  describe('openPopupTransIds', () => {
    it('should call StaticService.openPopupTransIds with correct parameters', () => {
      const requestId = 123;
      const transIds = 'ABC123';
      jest.spyOn(StaticService, 'openPopupTransIds');

      component.openPopupTransIds(requestId, transIds);

      expect(StaticService.openPopupTransIds).toHaveBeenCalledWith(requestId, transIds, modalService);
    });
  });

  describe('countInfoContent', () => {
    it('should call StaticService.countInfoContent with correct parameters', () => {
      const cashOutCount = 1;
      const settleCount = 2;
      const instantlySettleCount = 3;
      jest.spyOn(StaticService, 'countInfoContent');

      component.countInfoContent(cashOutCount, settleCount, instantlySettleCount);

      expect(StaticService.countInfoContent).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
    });
  });

  describe('displayTransId', () => {
    it('should return transId when ticketCount is not 0', () => {
      const result = component.displayTransId(1, 'ABC123');
      expect(result).toBe('ABC123');
    });

    it('should return "-" when ticketCount is 0', () => {
      const result = component.displayTransId(0, 'ABC123');
      expect(result).toBe('-');
    });
  });

  describe('isShowCountInfo', () => {
    it('should call StaticService.isShowCountInfo with correct parameters', () => {
      const cashOutCount = 1;
      const settleCount = 2;
      const instantlySettleCount = 3;
      jest.spyOn(StaticService, 'isShowCountInfo');

      component.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);

      expect(StaticService.isShowCountInfo).toHaveBeenCalledWith(cashOutCount, settleCount, instantlySettleCount);
    });
  });
});
