import { QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import clone from 'lodash/clone';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { IssueTypes } from '../../../../../component/filter/issue-types.model';
import { LogInfoRelatedEventComponent } from '../../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../../../../component/log-info-related-event/primitive-property.model';
import { OthersModel } from '../../../../../component/others/others.model';
import { TvDetectionComponent } from '../../../../../component/tv-detection/tv-detection.component';
import { TvDetectionModel } from '../../../../../component/tv-detection/tv-detection.model';
import { AddRequestService } from '../../../../../services/add-request.service';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { PopupService } from '../../../../../services/popup.service';
import { FilterTimeAreaComponent } from '../../../../red-card/app/event-red-card/filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { ConfirmDangerAcceptedModel } from '../confirm-danger-accepted/confirm-danger-accepted.model';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from './save-request.model';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestService: AddRequestService;
  let addRequestStore: AddRequestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SaveRequestService,
        {
          provide: ValidationService,
          useValue: {
            validateCommonData: jest.fn().mockReturnValue(true),
            isAllEventsValid: jest.fn().mockReturnValue(true),
            isEditingByAnotherUser: jest.fn().mockReturnValue(false)
          }
        },
        {
          provide: LogInfoService,
          useValue: {
            resetLogInfoOfEvent: jest.fn(),
            getLogInfo: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: PopupService,
          useValue: {
            showError: jest.fn()
          }
        },
        {
          provide: AddRequestService,
          useValue: {
            executeSaveRequest: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: AddRequestStore,
          useValue: {
            changeSavingRequestStatus: jest.fn(),
            changeBlockingUiStatus: jest.fn()
          }
        },
        {
          provide: EventLeagueComponent,
          useValue: {}
        },
        {
          provide: FilterTimeAreaComponent,
          useValue: {}
        },
        {
          provide: TvDetectionComponent,
          useValue: {}
        }
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestService = TestBed.inject(AddRequestService);
    addRequestStore = TestBed.inject(AddRequestStore);
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when all validations pass', async () => {
      const arg: SaveRequestArg = {
        addRequestStore,
        allEvents: [],
        filter: {} as FilterModel,
        eventLeagueComponent: {} as EventLeagueComponent,
        filterTimeAreaComponent: {} as FilterTimeAreaComponent,
        logInfoComponents: {
          toArray: () => [{
            filterTimeWithAllowanceComponent: { isValid: () => true, updateData: jest.fn() },
            showValidationDetail: jest.fn()
          }],
          forEach: function(callback: any) {
            this.toArray().forEach(callback);
          }
        } as unknown as QueryList<LogInfoRelatedEventComponent>,
        primitiveProps: {} as PrimitiveProperty,
        isEdit: false,
        requestId: 1,
        userId: 1,
        requestedBy: 'test',
        issueTypes: {} as IssueTypes,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        others: {} as OthersModel,
        actionIdOfFirstTimeAccess: '0',
        tvDetectionComponent: {} as TvDetectionComponent,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      };
      service['showPopupConfirmSave'] = jest.fn();

      const result = await service.recheckLogInfoBeforeSaveRequest(arg);

      expect(result).toBe(true);
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should return false when validation fails', async () => {
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);
      const arg: SaveRequestArg = {
        addRequestStore,
        allEvents: [],
        filter: {} as FilterModel,
        eventLeagueComponent: {} as EventLeagueComponent,
        filterTimeAreaComponent: {} as FilterTimeAreaComponent,
        logInfoComponents: {
          toArray: () => [{
            filterTimeWithAllowanceComponent: { isValid: () => true, updateData: jest.fn() },
            showValidationDetail: jest.fn()
          }],
          forEach: function(callback: any) {
            this.toArray().forEach(callback);
          }
        } as unknown as QueryList<LogInfoRelatedEventComponent>,
        primitiveProps: {} as PrimitiveProperty,
        isEdit: false,
        requestId: 1,
        userId: 1,
        requestedBy: 'test',
        issueTypes: {} as IssueTypes,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        others: {} as OthersModel,
        actionIdOfFirstTimeAccess: '0',
        tvDetectionComponent: {} as TvDetectionComponent,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      };
      service['showPopupConfirmSave'] = jest.fn();
      const result = await service.recheckLogInfoBeforeSaveRequest(arg);

      expect(result).toBe(false);
    });
  });

  describe('saveRequest', () => {
    it('should show popup when data is valid', async () => {
      // Mock document.getElementById
      const element = document.createElement('body');
      element.setAttribute('id', 'body');
      element.setAttribute('user-id', '123');
      document.body.appendChild(element);

      const arg: SaveRequestArg = {
        addRequestStore,
        allEvents: [],
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{
            value: '1',
            name: 'Test Action'
          }]
        } as FilterModel,
        eventLeagueComponent: {} as EventLeagueComponent,
        filterTimeAreaComponent: {} as FilterTimeAreaComponent,
        logInfoComponents: {
          toArray: () => [{
            filterTimeWithAllowanceComponent: { isValid: () => true, updateData: jest.fn() },
            showValidationDetail: jest.fn()
          }],
          forEach: function(callback: any) {
            this.toArray().forEach(callback);
          }
        } as unknown as QueryList<LogInfoRelatedEventComponent>,
        primitiveProps: {} as PrimitiveProperty,
        isEdit: false,
        requestId: 1,
        userId: 1,
        requestedBy: 'test',
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type',
            issueTypeId: 1,
            subIssueTypeNameCS: 'Test Sub Issue Type CS'
          }]
        } as IssueTypes,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        others: {} as OthersModel,
        actionIdOfFirstTimeAccess: '0',
        tvDetectionComponent: {} as TvDetectionComponent,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      };
      await service.saveRequest(arg);

      expect(arg.confirmDangerAccepted.isOpenDialog).toBe(true);
    });

    it('should not show popup when data is invalid', async () => {
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      const arg: SaveRequestArg = {
        addRequestStore,
        allEvents: [],
        filter: { isVoided: false, action: '1', actions: [{ value: '1', name: 'Test Action' }] } as FilterModel,
        eventLeagueComponent: {} as EventLeagueComponent,
        filterTimeAreaComponent: {} as FilterTimeAreaComponent,
        logInfoComponents: {
          toArray: () => [{
            filterTimeWithAllowanceComponent: { isValid: () => true, updateData: jest.fn() },
            showValidationDetail: jest.fn()
          }],
          forEach: function(callback: any) {
            this.toArray().forEach(callback);
          }
        } as unknown as QueryList<LogInfoRelatedEventComponent>,
        primitiveProps: {} as PrimitiveProperty,
        isEdit: false,
        requestId: 1,
        userId: 1,
        requestedBy: 'test',
        issueTypes: {} as IssueTypes,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        others: {} as OthersModel,
        actionIdOfFirstTimeAccess: '0',
        tvDetectionComponent: {} as TvDetectionComponent,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      };
      await service.saveRequest(arg);

      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when data is valid', async () => {
      const arg: SaveRequestArg = {
        addRequestStore,
        allEvents: [],
        filter: { isVoided: false, action: '1',actions: [{ value: '1', name: 'Test Action' }] } as FilterModel,
        eventLeagueComponent: {} as EventLeagueComponent,
        filterTimeAreaComponent: {} as FilterTimeAreaComponent,
        logInfoComponents: {
          toArray: () => [{
            filterTimeWithAllowanceComponent: { isValid: () => true, updateData: jest.fn() },
            showValidationDetail: jest.fn()
          }],
          forEach: function(callback: any) {
            this.toArray().forEach(callback);
          }
        } as unknown as QueryList<LogInfoRelatedEventComponent>,
        primitiveProps: {} as PrimitiveProperty,
        isEdit: false,
        requestId: 1,
        userId: 1,
        requestedBy: 'test',
        issueTypes: {} as IssueTypes,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        others: {} as OthersModel,
        actionIdOfFirstTimeAccess: '0',
        tvDetectionComponent: {} as TvDetectionComponent,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      };
      await service.onClickConfirmSave(arg);

      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(addRequestService.executeSaveRequest).toHaveBeenCalled();
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should show error when data is invalid', async () => {
      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);
      const arg: SaveRequestArg = {
        addRequestStore,
        allEvents: [],
        filter: { isVoided: false, action: '1', actions: [{ value: '1', name: 'Test Action' }] } as FilterModel,
        eventLeagueComponent: {} as EventLeagueComponent,
        filterTimeAreaComponent: {} as FilterTimeAreaComponent,
        logInfoComponents: {
          toArray: () => [{
            filterTimeWithAllowanceComponent: { isValid: () => true, updateData: jest.fn() },
            showValidationDetail: jest.fn()
          }],
          forEach: function(callback: any) {
            this.toArray().forEach(callback);
          }
        } as unknown as QueryList<LogInfoRelatedEventComponent>,
        primitiveProps: {} as PrimitiveProperty,
        isEdit: false,
        requestId: 1,
        userId: 1,
        requestedBy: 'test',
        issueTypes: {} as IssueTypes,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        others: {} as OthersModel,
        actionIdOfFirstTimeAccess: '0',
        tvDetectionComponent: {} as TvDetectionComponent,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      };
      await service.onClickConfirmSave(arg);

      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });
  });

  describe('validateVarCheck', () => {
    it('should return true when all events have var check', () => {
      const events: LogInfoRelatedEvent[] = [
        {
          isCheckedVar: true,
          subIssueTypeId: 1
        } as LogInfoRelatedEvent
      ];
      const result = service['validateVarCheck'](events);

      expect(result).toBe(true);
    });

    it('should return false when any event missing var check', () => {
      const events: LogInfoRelatedEvent[] = [
        {
          isCheckedVar: null,
          subIssueTypeId: 1,
          isHighLightVarCheck: false
        } as LogInfoRelatedEvent
      ];

      const result = service['validateVarCheck'](events);

      expect(result).toBe(false);
      expect(events[0].isHighLightVarCheck).toBe(true);
    });
  });

  describe('assignEventToModel', () => {
    it('should assign event to model with tv detection', () => {
      const event: LogInfoRelatedEvent = {
        isMainMatch: true,
        subIssueTypeId: 1,
        matchId: 1,
        voidTimeArea: {
          fromDateTime: '',
          toDateTime: '',
          paTime: 0,
          aaTime: 0,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      const tvDetectionModel: TvDetectionModel = {
        tvDetectionValue: 1,
        serviceAcceptTime: '',
        actualTime: '',
        minuteOffset: '1',
        secondOffset: '30'
      };

      const arg: SaveRequestArg = {
        addRequestStore,
        allEvents: [],
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        eventLeagueComponent: {} as EventLeagueComponent,
        filterTimeAreaComponent: {} as FilterTimeAreaComponent,
        logInfoComponents: {
          toArray: () => [{
            filterTimeWithAllowanceComponent: { isValid: () => true }
          }]
        } as unknown as QueryList<LogInfoRelatedEventComponent>,
        primitiveProps: {} as PrimitiveProperty,
        isEdit: false,
        requestId: 1,
        userId: 1,
        requestedBy: 'test',
        issueTypes: {} as IssueTypes,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        others: {} as OthersModel,
        actionIdOfFirstTimeAccess: '0',
        tvDetectionComponent: {} as TvDetectionComponent,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      };
      const result = service['assignEventToModel'](event, arg, tvDetectionModel);

      expect(result.isMainMatch).toBe(true);
      expect(result.tvDetectionValue).toBe(1);
      expect(result.serviceAcceptTime).toBe('');
      expect(result.actualTime).toBe('');
      expect(result.minuteOffset).toBe('1');
      expect(result.secondOffset).toBe('30');
    });

    it('should assign event to model without tv detection', () => {
      const event: LogInfoRelatedEvent = {
        isMainMatch: true,
        subIssueTypeId: 1,
        matchId: 1,
        voidTimeArea: {
          fromDateTime: '',
          toDateTime: '',
          paTime: 0,
          aaTime: 0,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      const tvDetectionModel: TvDetectionModel = {
        tvDetectionValue: 0,
        serviceAcceptTime: '',
        actualTime: '',
        minuteOffset: '0',
        secondOffset: '0'
      };

      const arg: SaveRequestArg = {
        addRequestStore,
        allEvents: [],
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        eventLeagueComponent: {} as EventLeagueComponent,
        filterTimeAreaComponent: {} as FilterTimeAreaComponent,
        logInfoComponents: {
          toArray: () => [{
            filterTimeWithAllowanceComponent: { isValid: () => true }
          }]
        } as unknown as QueryList<LogInfoRelatedEventComponent>,
        primitiveProps: {} as PrimitiveProperty,
        isEdit: false,
        requestId: 1,
        userId: 1,
        requestedBy: 'test',
        issueTypes: {} as IssueTypes,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        others: {} as any,
        actionIdOfFirstTimeAccess: '0',
        tvDetectionComponent: {} as TvDetectionComponent,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      };
      const result = service['assignEventToModel'](event, arg, tvDetectionModel);

      expect(result.isMainMatch).toBe(true);
      expect(result.tvDetectionValue).toBe(0);
      expect(result.minuteOffset).toBe(undefined);
      expect(result.secondOffset).toBe(undefined);
    });
  });

  describe('showPopupConfirmSave', () => {
    let mockDocument: Document;
    let mockBody: HTMLElement;

    beforeEach(() => {
      mockBody = {
        getAttribute: jest.fn().mockReturnValue('123')
      } as unknown as HTMLElement;
      mockDocument = {
        getElementById: jest.fn().mockReturnValue(mockBody)
      } as unknown as Document;
      (global as any).document = mockDocument;
    });

    it('should set warningRelatedEvents when there are events with NO_VALID_TICKETS_IN_RANGE message', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [
          {
            isMainMatch: false,
            eventName: 'Event 1',
            messageValidationLogInfo: [
              {
                reason: TEXT.NO_VALID_TICKETS_IN_RANGE
              }
            ]
          } as LogInfoRelatedEvent
        ],
        confirmDangerAccepted: {
          warningRelatedEvents: []
        } as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.warningRelatedEvents).toContain('Event 1');
    });

    it('should set isHasSettledTicket when there are events with settleCount > 0', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [
          {
            isMainMatch: false,
            eventName: 'Event 1',
            messageValidationLogInfo: [],
            logInfoDetail: {
              settleCount: 1
            }
          } as LogInfoRelatedEvent
        ],
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.isHasSettledTicket).toBe(true);
    });

    it('should set isHasWarningEvent when there are events with non-error messages', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [
          {
            isMainMatch: false,
            eventName: 'Event 1',
            messageValidationLogInfo: [
              {
                isError: false,
                reason: 'Test reason'
              }
            ]
          } as LogInfoRelatedEvent
        ],
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.isHasWarningEvent).toBe(true);
    });

    it('should set isHasWarningEditTakeNoteRequest when action is TAKE_NOTE_ID and different from actionIdOfFirstTimeAccess', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: TVSRequestActionType.TAKE_NOTE_ID.toString(),
          actions: [{ value: TVSRequestActionType.TAKE_NOTE_ID.toString(), name: 'Test Action' }]
        } as FilterModel,
        allEvents: [],
        actionIdOfFirstTimeAccess: 'DIFFERENT_ACTION',
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.isHasWarningEditTakeNoteRequest).toBe(true);
    });

    it('should set isHasWarningRangeTime when there are events with isHasWarningRangeTime true', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [
          {
            isMainMatch: false,
            eventName: 'Event 1',
            messageValidationLogInfo: [],
            logInfoDetail: {
              isHasWarningRangeTime: true
            }
          } as LogInfoRelatedEvent
        ],
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.isHasWarningRangeTime).toBe(true);
    });

    it('should set requestId and requestedBy from arg', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [],
        requestId: 123,
        requestedBy: 'testUser',
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.requestId).toBe(123);
      expect(arg.confirmDangerAccepted.requestedBy).toBe('testUser');
    });

    it('should set isEditingByAnotherUser based on validationService result', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [],
        isEdit: true,
        userId: 456,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      jest.spyOn(validationService, 'isEditingByAnotherUser').mockReturnValue(true);

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.isEditingByAnotherUser).toBe(true);
    });

    it('should set issueTypeName and subIssueTypeName from issueTypes', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '2',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [],
        issueTypes: {
          issueTypes: [
            {
              issueTypeId: 1,
              issueTypeName: 'Test Issue Type'
            }
          ],
          subIssueTypes: [
            {
              subIssueTypeId: 2,
              subIssueTypeName: 'Test Sub Issue Type'
            }
          ]
        } as IssueTypes,
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.issueTypeName).toBe('Test Issue Type');
      expect(arg.confirmDangerAccepted.subIssueTypeName).toBe('Test Sub Issue Type');
    });

    it('should set isOpenDialog to true and clone confirmDangerAccepted', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: false,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [],
        confirmDangerAccepted: {} as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.isOpenDialog).toBe(true);
      expect(arg.confirmDangerAccepted).not.toBe(clone(arg.confirmDangerAccepted));
    });

    it('should not set warning flags when filter.isVoided is true', () => {
      const arg = {
        primitiveProps: {} as PrimitiveProperty,
        filter: {
          isVoided: true,
          issueTypeId: '1',
          subIssueTypeId: '1',
          action: '1',
          actions: [{ value: '1', name: 'Test Action' }]
        } as FilterModel,
        allEvents: [
          {
            isMainMatch: false,
            eventName: 'Event 1',
            messageValidationLogInfo: [
              {
                reason: TEXT.NO_VALID_TICKETS_IN_RANGE
              }
            ],
            logInfoDetail: {
              settleCount: 1,
              isHasWarningRangeTime: true
            }
          } as LogInfoRelatedEvent
        ],
        confirmDangerAccepted: {
          warningRelatedEvents: []
        } as ConfirmDangerAcceptedModel,
        issueTypes: {
          issueTypes: [{
            issueTypeId: 1,
            issueTypeName: 'Test Issue Type'
          }],
          subIssueTypes: [{
            subIssueTypeId: 1,
            subIssueTypeName: 'Test Sub Issue Type'
          }]
        } as IssueTypes
      } as SaveRequestArg;

      service['showPopupConfirmSave'](arg);

      expect(arg.confirmDangerAccepted.warningRelatedEvents).toHaveLength(0);
      expect(arg.confirmDangerAccepted.isHasSettledTicket).toBeUndefined();
      expect(arg.confirmDangerAccepted.isHasWarningEvent).toBeUndefined();
      expect(arg.confirmDangerAccepted.isHasWarningRangeTime).toBeUndefined();
    });
  });
});
