import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { RelatedEventsComponent } from './related-events.component';
import { RelatedEventService } from '../services/related-event.service';
import { EventWrongScoreService } from '../services/event-wrong-score.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { MatchType } from '../../../../../utility/constants/config';
import { AddChildMatchModel } from '../../../../../utility/components/add-child-match/add-child-match.model';
import _ from 'lodash';
import { LogInfoService } from '../services/log-info.service';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { CreateMapService } from '../services/create-map.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { LogInfoRelatedEventComponent } from '../../components/log-info-related-event/log-info-related-event.component';
import { QueryList } from '@angular/core';

class Helper {
  static getFakeLogInfoRelatedEvent(): LogInfoRelatedEvent {
    const event = new LogInfoRelatedEvent();
    event.matchId = 1;
    event.matchCode = 'TEST001';
    event.sportType = 1;
    event.eventDate = new Date();
    return event;
  }

  static getFakeFilterModel(): FilterModel {
    const model = new FilterModel();
    model.isVoided = false;
    return model;
  }

  static getFakeFilterTimeWithAllowance(): FilterTimeWithAllowance {
    const model = new FilterTimeWithAllowance();
    model.fromDateTime = new Date().toISOString();
    model.toDateTime = new Date().toISOString();
    model.aaTime = 0;
    model.paTime = 0;
    model.saTime = 0;
    return model;
  }

  static getFakePrimitiveProperty(): PrimitiveProperty {
    const prop = new PrimitiveProperty();
    prop.isBlock = false;
    return prop;
  }
}

describe('RelatedEventsComponent', () => {
  let component: RelatedEventsComponent;
  let fixture: ComponentFixture<RelatedEventsComponent>;
  let relatedEventService: RelatedEventService;
  let eventWrongScoreService: EventWrongScoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ RelatedEventService, EventWrongScoreService, LogInfoService,
        ValidationService, WrongScoreService, CreateMapService, AddRequestApiService ]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedEventsComponent);
    relatedEventService = fixture.debugElement.injector.get(RelatedEventService);
    eventWrongScoreService = fixture.debugElement.injector.get(EventWrongScoreService);
    component = fixture.componentInstance;

    // Set default input values
    component.logInfoComponents = [{}] as unknown as QueryList<LogInfoRelatedEventComponent>;
    component.relatedEvents = [Helper.getFakeLogInfoRelatedEvent()];
    component.filter = Helper.getFakeFilterModel();
    component.isEdit = false;
    component.primitiveProps = Helper.getFakePrimitiveProperty();
    component.issueTypes = new IssueTypes();
    component.defaultFilterTimeWithAllowance = Helper.getFakeFilterTimeWithAllowance();
    component.requestId = 1;
    component.mainEvent = Helper.getFakeLogInfoRelatedEvent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleClickAddRelatedEvent', () => {
    it('should call addRelatedEventByInput with correct arguments', async () => {
      // Arrange
      jest.spyOn(relatedEventService, 'addRelatedEventByInput');

      // Act
      await component.handleClickAddRelatedEvent();

      // Assert
      expect(relatedEventService.addRelatedEventByInput).toHaveBeenCalled();
    });
  });

  describe('isDisabledChildMatches', () => {
    it('should return true when filter is voided', () => {
      // Arrange
      component.filter.isVoided = true;
      component.childEvents = [];

      // Act
      const result = component.isDisabledChildMatches();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when no child matches exist', () => {
      // Arrange
      component.filter.isVoided = false;
      component.childEvents = [];

      // Act
      const result = component.isDisabledChildMatches();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when child matches exist and not voided', () => {
      // Arrange
      component.filter.isVoided = false;
      component.childEvents = [{ matchType: MatchType.CHILD } as ChildMatchModel];

      // Act
      const result = component.isDisabledChildMatches();

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('showAddChildMatchModal', () => {
    it('should set correct values in addChildMatchModel', () => {
      // Arrange
      const matchType = MatchType.CHILD;
      component.relatedEvents = [
        { matchId: 1 } as LogInfoRelatedEvent,
        { matchId: 2 } as LogInfoRelatedEvent
      ];

      // Act
      component.showAddChildMatchModal(matchType);

      // Assert
      expect(component.addChildMatchModel.selectedMatchIds).toEqual([1, 2]);
      expect(component.addChildMatchModel.matchType).toBe(matchType);
      expect(component.addChildMatchModel.isOpen).toBeTruthy();
    });
  });

  describe('countChildMatches', () => {
    it('should return correct count of child matches', () => {
      // Arrange
      component.childEvents = [
        { matchType: MatchType.CHILD } as ChildMatchModel,
        { matchType: MatchType.CHILD } as ChildMatchModel,
        { matchType: MatchType.LINK } as ChildMatchModel
      ];

      // Act
      const result = component.countChildMatches();

      // Assert
      expect(result).toBe(2);
    });
  });

  describe('countLinkMatches', () => {
    it('should return correct count of link matches', () => {
      // Arrange
      component.childEvents = [
        { matchType: MatchType.LINK } as ChildMatchModel,
        { matchType: MatchType.LINK } as ChildMatchModel,
        { matchType: MatchType.CHILD } as ChildMatchModel
      ];

      // Act
      const result = component.countLinkMatches();

      // Assert
      expect(result).toBe(2);
    });
  });

  describe('handleDeleteEvent', () => {
    it('should remove event with matching matchId', () => {
      // Arrange
      component.relatedEvents = [
        { matchId: 1 } as LogInfoRelatedEvent,
        { matchId: 2 } as LogInfoRelatedEvent
      ];

      // Act
      component.handleDeleteEvent(1);

      // Assert
      expect(component.relatedEvents.length).toBe(1);
      expect(component.relatedEvents[0].matchId).toBe(2);
    });
  });

  describe('saveRelatedEvent', () => {
    it('should update related events and add new events', async () => {
      // Arrange
      const selectedRelatedEvents = [
        { 
          matchId: 1, 
          matchCode: 'TEST001', 
          aa: '0', 
          pa: '0', 
          sa: '0',
          isChecked: false,
          matchType: MatchType.CHILD,
          leagueName: '',
          matchEvent: ''
        } as ChildMatchModel,
        { 
          matchId: 2, 
          matchCode: 'TEST002', 
          aa: '0', 
          pa: '0', 
          sa: '0',
          isChecked: false,
          matchType: MatchType.CHILD,
          leagueName: '',
          matchEvent: ''
        } as ChildMatchModel
      ];
      component.relatedEvents = [{ matchId: 1 } as LogInfoRelatedEvent];
      component.childEvents = [{ matchId: 1 } as ChildMatchModel];
      component.filter = { subIssueTypeId: '1' } as FilterModel;
      component.defaultFilterTimeWithAllowance = Helper.getFakeFilterTimeWithAllowance();
      jest.spyOn(eventWrongScoreService, 'updateCheckRelatedEvent').mockReturnValue([
        { matchId: 1, matchCode: 'TEST001' } as LogInfoRelatedEvent
      ]);
      jest.spyOn(relatedEventService, 'addEventByInputAndSelected');
      relatedEventService['addEventByInputAndSelected'] = jest.fn();

      // Act
      await component.saveRelatedEvent(selectedRelatedEvents);

      // Assert
      expect(eventWrongScoreService.updateCheckRelatedEvent).toHaveBeenCalled();
      expect(relatedEventService.addEventByInputAndSelected).toHaveBeenCalled();
      expect(component.relatedEvents.length).toBe(1);
    });
  });

  describe('getDataWhenSearch', () => {
    it('should update child events and related events', async () => {
      // Arrange
      const mockChildEvents = [{ matchId: 1 } as ChildMatchModel];
      const mockViewModel = {
        transInfoAddRequestModel: {
          transInfoJson: '',
          unMarkTransIds: '',
          markTransIds: '',
          removeTransIds: ''
        },
        getLogInfoModels: []
      };
      component.primitiveProps = {
        transInfoAddRequestModel: {
          transInfoJson: '',
          unMarkTransIds: '',
          markTransIds: '',
          removeTransIds: ''
        },
        filterBy: 1,
        isBlock: false,
        actualScore: '',
        isShowActualScore: false,
        isShowRelatedEvents: false
      } as unknown as PrimitiveProperty;
      jest.spyOn(relatedEventService, 'getGetInfoChildMatch').mockResolvedValue(mockChildEvents);
      jest.spyOn(relatedEventService, 'getDataRelatedEventWhenSearch').mockImplementation(async () => {
        component.primitiveProps.transInfoAddRequestModel = mockViewModel.transInfoAddRequestModel;
        return;
      });
      const addRequestApiService = TestBed.inject(AddRequestApiService);
      jest.spyOn(addRequestApiService, 'getSubIssueTypeLinkMatch').mockResolvedValue([]);
      component.logInfoComponents[0].showValidationDetail = jest.fn();

      // Act
      await component.getDataWhenSearch();

      // Assert
      expect(relatedEventService.getGetInfoChildMatch).toHaveBeenCalled();
      expect(relatedEventService.getDataRelatedEventWhenSearch).toHaveBeenCalled();
      expect(component.childEvents).toEqual(mockChildEvents);
    });
  });

  describe('resetData', () => {
    it('should reset all data to initial state', () => {
      // Arrange
      component.relatedEvents = [{ matchId: 1 } as LogInfoRelatedEvent];
      component.childEvents = [{ matchId: 1 } as ChildMatchModel];
      component.addChildMatchModel = { isOpen: true } as AddChildMatchModel;

      // Act
      component.resetData();

      // Assert
      expect(component.relatedEvents).toEqual([]);
      expect(component.childEvents).toEqual([]);
      expect(component.addChildMatchModel).toEqual(new AddChildMatchModel());
    });
  });
});
