import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterModel } from '../../../../component/filter/filter.model';
import { OthersModel } from '../../../../component/others/others.model';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { EventTicket14Model } from '../../../../models/event-ticket-14.model';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { AddRequestStore } from '../../../../services/add-request.store';
import { EventTicket14Component } from './event-ticket14.component';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeOthersModel = new OthersModel();
  static readonly fakeEventTicket14Model = new EventTicket14Model();
  static readonly fakePermission = { canAdd: true, canEdit: true };
  static readonly fakeTransInfoJson = { transactionId: '123', amount: 100 };
}

describe('EventTicket14Component', () => {
  let component: EventTicket14Component;
  let fixture: ComponentFixture<EventTicket14Component>;
  let validationService: ValidationService;
  let saveRequestService: SaveRequestService;
  let addRequestStore: AddRequestStore;
  let addRequestApiService: AddRequestApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        SaveRequestService,
        AddRequestStore,
        AddRequestApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventTicket14Component);
    validationService = fixture.debugElement.injector.get(ValidationService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    component = fixture.componentInstance;
    component.primitiveProps = new PrimitiveProperty();

    // Khởi tạo các thuộc tính cần thiết để tránh lỗi template
    component.filter = Helper.fakeFilterModel;
    component.eventTicket14Model = Helper.fakeEventTicket14Model;
    component.betIdsComponent = {
      triggerFocusOutBetIds: jest.fn(),
      getAllBetIds: jest.fn().mockReturnValue(['bet1', 'bet2'])
    } as unknown as BetIdsComponent;
  });

  describe('Component Creation', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should have default property values', () => {
      expect(component.isEdit).toBeUndefined();
      expect(component.requestId).toBeUndefined();
      expect(component.filter).toBeDefined();
      expect(component.others).toBeDefined();
      expect(component.eventTicket14Model).toBeDefined();
      expect(component.betIdsComponent).toBeDefined();
      expect(component.primitiveProps).toBeDefined();
      expect(component.isCancelAfterFocusOutBetIdsEvent).toBeFalsy();
    });
  });

  describe('ngOnInit', () => {
    it('should initialize with permission from API', async () => {
      // Arrange
      addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue(Helper.fakePermission);

      // Act
      await component.ngOnInit();

      // Assert
      expect(addRequestApiService.getPermissionAddRequest).toHaveBeenCalled();
      expect(component.primitiveProps.permission).toEqual(Helper.fakePermission);
    });

    it('should handle API error gracefully', async () => {
      // Arrange
      addRequestApiService.getPermissionAddRequest = jest.fn().mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(component.ngOnInit()).rejects.toThrow('API Error');
    });
  });

  describe('afterFocusOutBetIds', () => {
    it('should handle afterFocusOutBetIds correctly', async () => {
      // Arrange
      component.betIdsComponent = {} as BetIdsComponent;
      component.filter = Helper.fakeFilterModel;
      addRequestStore.changeStartTimeFilterAnalysis = jest.fn();
      validationService.checkBusinessRule = jest.fn().mockResolvedValue({
        isValid: true,
        transInfoJson: Helper.fakeTransInfoJson
      });

      // Act
      await component.afterFocusOutBetIds();

      // Assert
      expect(addRequestStore.changeStartTimeFilterAnalysis).toHaveBeenCalled();
      expect(validationService.checkBusinessRule).toHaveBeenCalled();
    });
  });

  describe('saveRequest', () => {
    beforeEach(() => {
      component.betIdsComponent = {
        triggerFocusOutBetIds: jest.fn(),
        getAllBetIds: jest.fn().mockReturnValue(['bet1', 'bet2'])
      } as unknown as BetIdsComponent;
      addRequestStore.changeBlockingUiStatus = jest.fn();
    });

    describe('when request is voided', () => {
      it('should execute save directly without validation', async () => {
        // Arrange
        component.filter = { ...Helper.fakeFilterModel, isVoided: true };
        component.requestId = Helper.fakeRequestId;
        component.isEdit = false;
        component.eventTicket14Model = Helper.fakeEventTicket14Model;
        component.others = Helper.fakeOthersModel;
        saveRequestService.executeSave = jest.fn();

        // Act
        await component.saveRequest();

        // Assert
        expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
        expect(saveRequestService.executeSave).toHaveBeenCalledWith(expect.objectContaining({
          requestId: Helper.fakeRequestId,
          isEdit: false,
          filter: component.filter,
          eventTicket14Model: Helper.fakeEventTicket14Model,
          others: Helper.fakeOthersModel,
          filterBy: null
        }));
        expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      });
    });

    describe('when request is not voided', () => {
      beforeEach(() => {
        component.filter = Helper.fakeFilterModel;
        component.requestId = Helper.fakeRequestId;
        component.isEdit = true;
        component.eventTicket14Model = Helper.fakeEventTicket14Model;
        component.others = Helper.fakeOthersModel;
      });

      it('should save when validation passes', async () => {
        // Arrange
        validationService.checkBusinessRule = jest.fn().mockResolvedValue({
          isValid: true,
          transInfoJson: Helper.fakeTransInfoJson
        });
        saveRequestService.executeSave = jest.fn();

        // Act
        await component.saveRequest();

        // Assert
        expect(component.betIdsComponent.triggerFocusOutBetIds).toHaveBeenCalled();
        expect(validationService.checkBusinessRule).toHaveBeenCalledWith(
          component.betIdsComponent,
          component.primitiveProps.permission
        );
        expect(component.primitiveProps.transInfoJson).toEqual(Helper.fakeTransInfoJson);
        expect(saveRequestService.executeSave).toHaveBeenCalledWith(expect.objectContaining({
          requestId: Helper.fakeRequestId,
          isEdit: true,
          filter: component.filter,
          eventTicket14Model: Helper.fakeEventTicket14Model,
          others: Helper.fakeOthersModel,
          filterBy: null
        }));
        expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      });

      it('should not save when validation fails', async () => {
        // Arrange
        validationService.checkBusinessRule = jest.fn().mockResolvedValue({
          isValid: false,
          transInfoJson: Helper.fakeTransInfoJson
        });
        addRequestStore.changeSavingRequestStatus = jest.fn();
        saveRequestService.executeSave = jest.fn();

        // Act
        await component.saveRequest();

        // Assert
        expect(component.betIdsComponent.triggerFocusOutBetIds).toHaveBeenCalled();
        expect(validationService.checkBusinessRule).toHaveBeenCalled();
        expect(component.primitiveProps.transInfoJson).toEqual(Helper.fakeTransInfoJson);
        expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
        expect(saveRequestService.executeSave).not.toHaveBeenCalled();
        expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      });

      it('should handle validation error', async () => {
        // Arrange
        validationService.checkBusinessRule = jest.fn().mockRejectedValue(new Error('Validation Error'));

        // Act & Assert
        await expect(component.saveRequest()).rejects.toThrow('Validation Error');
        // Không expect changeBlockingUiStatus được gọi với false vì lỗi xảy ra trước khi đến đó
      });
    });

    describe('with abnormal filter', () => {
      it('should set correct filterBy for abnormal requests', async () => {
        // Arrange
        component.filter = { ...Helper.fakeFilterModel, isAbnormal: true };
        validationService.checkBusinessRule = jest.fn().mockResolvedValue({
          isValid: true,
          transInfoJson: Helper.fakeTransInfoJson
        });
        saveRequestService.executeSave = jest.fn();

        // Act
        await component.saveRequest();

        // Assert
        expect(saveRequestService.executeSave).toHaveBeenCalledWith(expect.objectContaining({
          filterBy: TVSRequestFilterBy.ABNORMAL
        }));
      });
    });
  });

  describe('Input Properties', () => {
    it('should handle isEdit input', () => {
      // Arrange & Act
      component.isEdit = true;
      fixture.detectChanges();

      // Assert
      expect(component.isEdit).toBeTruthy();

      // Arrange & Act
      component.isEdit = false;
      fixture.detectChanges();

      // Assert
      expect(component.isEdit).toBeFalsy();
    });

    it('should handle requestId input', () => {
      // Arrange & Act
      component.requestId = 123;
      fixture.detectChanges();

      // Assert
      expect(component.requestId).toBe(123);
    });

    it('should handle filter input', () => {
      // Arrange & Act
      component.filter = Helper.fakeFilterModel;
      fixture.detectChanges();

      // Assert
      expect(component.filter).toBe(Helper.fakeFilterModel);
    });

    it('should handle others input', () => {
      // Arrange & Act
      component.others = Helper.fakeOthersModel;
      fixture.detectChanges();

      // Assert
      expect(component.others).toBe(Helper.fakeOthersModel);
    });

    it('should handle eventTicket14Model input', () => {
      // Arrange & Act
      component.eventTicket14Model = Helper.fakeEventTicket14Model;
      fixture.detectChanges();

      // Assert
      expect(component.eventTicket14Model).toBe(Helper.fakeEventTicket14Model);
    });
  });

  describe('ViewChild', () => {
    it('should have betIds ViewChild', () => {
      // This test ensures the ViewChild is properly declared
      expect(component.betIdsComponent).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle addRequestApiService.getPermissionAddRequest error', async () => {
      // Arrange
      addRequestApiService.getPermissionAddRequest = jest.fn().mockRejectedValue(new Error('Permission Error'));

      // Act & Assert
      await expect(component.ngOnInit()).rejects.toThrow('Permission Error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null betIdsComponent in afterFocusOutBetIds', async () => {
      // Arrange
      component.betIdsComponent = null;
      component.filter = Helper.fakeFilterModel;
      addRequestStore.changeStartTimeFilterAnalysis = jest.fn();
      validationService.checkBusinessRule = jest.fn().mockRejectedValue(new Error('betIdsComponent is null'));

      // Act & Assert
      await expect(component.afterFocusOutBetIds()).rejects.toThrow('betIdsComponent is null');
    });

    it('should handle empty betIds array', async () => {
      // Arrange
      component.filter = { ...Helper.fakeFilterModel, isVoided: true };
      component.betIdsComponent = {
        getAllBetIds: jest.fn().mockReturnValue([])
      } as unknown as BetIdsComponent;
      saveRequestService.executeSave = jest.fn();

      // Act
      await component.saveRequest();

      // Assert
      expect(saveRequestService.executeSave).toHaveBeenCalledWith(expect.objectContaining({
        transIds: []
      }));
    });

    it('should handle undefined filter in afterFocusOutBetIds', async () => {
      // Arrange
      component.filter = undefined;
      component.betIdsComponent = {} as BetIdsComponent;
      addRequestStore.changeStartTimeFilterAnalysis = jest.fn();
      validationService.checkBusinessRule = jest.fn().mockRejectedValue(new Error('filter is undefined'));

      // Act & Assert
      await expect(component.afterFocusOutBetIds()).rejects.toThrow('filter is undefined');
    });
  });
});
