import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import { ModalService } from '../../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { StaticService } from '../../../../../../utility/services/static.service';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { ValidationMessage } from '../../../../../models/get-log-info.model';
import { EventWrongScoreService } from '../services/event-wrong-score.service';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { MainLogInfoComponent } from './main-log-info.component';

class Helper {
  static getFakeLogInfo(): LogInfoRelatedEvent {
    return {
      matchId: 1,
      leagueName: 'Test League',
      isMainMatch: true,
      eventName: 'Test Event',
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      subIssueTypeId: 1,
      voidTimeArea: 'Test Area',
      tvDetectionModel: { value: 0 },
      sportType: 'Football',
      logInfoDetail: {
        matchId: 1,
        highlightAcceptType: 'AA',
        minTime: new Date()
      },
      messageValidationLogInfo: [] as ValidationMessage[]
    } as unknown as LogInfoRelatedEvent;
  }
}

describe('MainLogInfoComponent', () => {
  let component: MainLogInfoComponent;
  let fixture: ComponentFixture<MainLogInfoComponent>;
  let eventWrongScoreService: EventWrongScoreService;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ EventWrongScoreService, ModalService, ValidationService, WrongScoreService ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLogInfoComponent);
    eventWrongScoreService = fixture.debugElement.injector.get(EventWrongScoreService);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;

    // Set default input values
    component.logInfo = Helper.getFakeLogInfo();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displayFullDateTimeFormat', () => {
    it('should format date time correctly', () => {
      const testDate = new Date('2024-03-20T10:00:00');
      const result = component.displayFullDateTimeFormat(testDate);
      expect(result).toBe(moment(testDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT));
    });
  });

  describe('isShowCountInfo', () => {
    it('should call StaticService.isShowCountInfo with correct parameters', () => {
      const spy = jest.spyOn(StaticService, 'isShowCountInfo');
      component.isShowCountInfo(1, 2, 3);
      expect(spy).toHaveBeenCalledWith(1, 2, 3);
    });
  });

  describe('countInfoContent', () => {
    it('should call StaticService.countInfoContent with correct parameters', () => {
      const spy = jest.spyOn(StaticService, 'countInfoContent');
      component.countInfoContent(1, 2, 3);
      expect(spy).toHaveBeenCalledWith(1, 2, 3);
    });
  });

  describe('displayMinTime', () => {
    it('should return "-" when minTime is null', () => {
      const result = component.displayMinTime(null);
      expect(result).toBe('-');
    });

    it('should return formatted time with acceptTypeName when acceptTypeName exists', () => {
      component.acceptTypeName = 'AA';
      const testDate = new Date('2024-03-20T10:00:00');
      const result = component.displayMinTime(testDate);
      expect(result).toBe(`${moment(testDate).format(DateTimeFormat.TIME_FORMAT)} - AA`);
    });

    it('should return only formatted time when acceptTypeName is empty', () => {
      component.acceptTypeName = '';
      const testDate = new Date('2024-03-20T10:00:00');
      const result = component.displayMinTime(testDate);
      expect(result).toBe(moment(testDate).format(DateTimeFormat.TIME_FORMAT));
    });
  });

  describe('getHighlightMinTimeClass', () => {
    it('should call eventWrongScoreService.getHighlightMinTimeClass and set acceptTypeName', () => {
      const mockResult = {
        highlightTimeClass: 'highlight-class',
        acceptTypeName: 'AA'
      };
      jest.spyOn(eventWrongScoreService, 'getHighlightMinTimeClass').mockReturnValue(mockResult);

      const result = component.getHighlightMinTimeClass(new Date());

      expect(eventWrongScoreService.getHighlightMinTimeClass).toHaveBeenCalled();
      expect(component.acceptTypeName).toBe('AA');
      expect(result).toBe('highlight-class');
    });
  });

  describe('openPopupTransIds', () => {
    it('should call StaticService.openPopupTransIds with correct parameters', () => {
      const spy = jest.spyOn(StaticService, 'openPopupTransIds');
      component.openPopupTransIds(1, '123,456');
      expect(spy).toHaveBeenCalledWith(1, '123,456', modalService);
    });
  });

  describe('isShowLogInfo', () => {
    it('should return true when matchId > 0', () => {
      component.logInfo.logInfoDetail.matchId = 1;
      expect(component.isShowLogInfo()).toBeTruthy();
    });

    it('should return true when messageValidationLogInfo has items', () => {
      component.logInfo.logInfoDetail.matchId = 0;
      component.logInfo.messageValidationLogInfo = [{
        isError: false,
        reason: 'Test reason',
        isShowPopup: false
      }];
      expect(component.isShowLogInfo()).toBeTruthy();
    });

    it('should return false when matchId = 0 and no messageValidationLogInfo', () => {
      component.logInfo.logInfoDetail.matchId = 0;
      component.logInfo.messageValidationLogInfo = [];
      expect(component.isShowLogInfo()).toBeFalsy();
    });
  });
});
