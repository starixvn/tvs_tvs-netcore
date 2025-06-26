import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { BetIdsComponent } from '../../../utility/components/bet-ids/bet-ids.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from '../app.service';
import { ValidationService } from '../services/validation.service';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { GroupNumber, NumberItem } from '../../../utility/components/bet-ids/bet-ids.model';

class Helper {
  static readonly fakeInvalidTransIds = '123,456';
  static readonly fakeMovedTransIds = '789';
  static readonly fakeAffectedLicensees = 'LICENSEE1,LICENSEE2';
  static readonly fakeRemark = ['Remark1', 'Remark2'];
}

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let appService: jest.Mocked<AppService>;
  let validationService: jest.Mocked<ValidationService>;
  let groupNumber: GroupNumber;

  beforeEach(async () => {
    groupNumber = new GroupNumber();
    groupNumber.items = [
      new NumberItem('123'),
      new NumberItem('456')
    ];

    const mockAppService = {
      getRemark: jest.fn().mockResolvedValue(Helper.fakeRemark)
    };

    const mockValidationService = {
      highlightInvalidTransIds: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        FilterComponent,
        FormsModule,
        CommonModule,
        TooltipComponent
      ],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: ValidationService, useValue: mockValidationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    appService = TestBed.inject(AppService) as jest.Mocked<AppService>;
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
    component.betIdsComponent = {} as unknown as BetIdsComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize tooltip and get remarks', async () => {
      // Act
      await component.ngOnInit();

      // Assert
      expect(component.tooltip.element).toBeDefined();
      expect(appService.getRemark).toHaveBeenCalled();
      expect(component.remark).toEqual(Helper.fakeRemark);
    });
  });

  describe('ngOnChanges', () => {
    it('should highlight invalid trans IDs when invalidTransIds changes', () => {
      // Arrange
      const changes = {
        invalidTransIds: {
          currentValue: Helper.fakeInvalidTransIds,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      };
      component.invalidTransIds = Helper.fakeInvalidTransIds;
      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(validationService.highlightInvalidTransIds).toHaveBeenCalled();
      expect(component.isShowRemoveInvalid).toBe(true);
    });

    it('should highlight invalid trans IDs when movedTransIds changes', () => {
      // Arrange
      const changes = {
        movedTransIds: {
          currentValue: Helper.fakeMovedTransIds,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      };
      validationService.highlightInvalidTransIds = jest.fn();

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(validationService.highlightInvalidTransIds).toHaveBeenCalled();
    });
  });

  describe('createTicketsQuery', () => {
    it('should create tickets query with correct values', () => {
      // Arrange
      component.abnormalBetType = '0';
      component.includeMainParlay = true;
      component.betIdsComponent.getAllBetIds = jest.fn().mockReturnValue('123,456');

      // Act
      const result = component.createTicketsQuery();

      // Assert
      expect(result).toEqual({
        transIds: '123,456',
        abnormalBetType: '0',
        includeMainParlay: true
      });
      expect(component.betIdsComponent.getAllBetIds).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should emit search event when bet IDs exist', () => {
      // Arrange
      component.betIdsComponent.isHasBetId = jest.fn().mockReturnValue(true);
      const searchSpy = jest.spyOn(component.searchEvent, 'emit');
      component.betIdsComponent.getAllBetIds = jest.fn().mockReturnValue('123,456');

      // Act
      component.search();

      // Assert
      expect(searchSpy).toHaveBeenCalled();
    });

    it('should not emit search event when no bet IDs exist', () => {
      // Arrange
      component.betIdsComponent.isHasBetId = jest.fn().mockReturnValue(false);
      const searchSpy = jest.spyOn(component.searchEvent, 'emit');

      // Act
      component.search();

      // Assert
      expect(searchSpy).not.toHaveBeenCalled();
    });
  });

  describe('removeInvalidTransIds', () => {
    it('should remove invalid and moved trans IDs', () => {
      // Arrange
      component.invalidTransIds = Helper.fakeInvalidTransIds;
      component.movedTransIds = Helper.fakeMovedTransIds;
      component.betIdsComponent.groupNumber = new GroupNumber();
      component.betIdsComponent.groupNumber.items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789'),
        new NumberItem('1')
      ];
      component.removeInvalidTransIdsEvent.emit = jest.fn();
      component.betIdsComponent.removeTransId = jest.fn();

      // Act
      component.removeInvalidTransIds();

      // Assert
      expect(component.betIdsComponent.removeTransId).toHaveBeenCalledWith(Helper.fakeInvalidTransIds);
      expect(component.betIdsComponent.removeTransId).toHaveBeenCalledWith(Helper.fakeMovedTransIds);
      expect(component.removeInvalidTransIdsEvent.emit).toHaveBeenCalled();
    });
  });

  describe('resetFilter', () => {
    it('should reset all filter values to default', () => {
      // Arrange
      component.isAbnormalBet = true;
      component.transIds = '123';
      component.isShowRemoveInvalid = true;
      component.isShowAffectedLicensees = true;
      component.includeMainParlay = true;
      component.abnormalBetType = '0';
      component.betIdsComponent.clearBetId = jest.fn();
      // Act
      component.resetFilter();

      // Assert
      expect(component.isAbnormalBet).toBe(false);
      expect(component.transIds).toBe('');
      expect(component.isShowRemoveInvalid).toBe(false);
      expect(component.isShowAffectedLicensees).toBe(false);
      expect(component.includeMainParlay).toBe(false);
      expect(component.abnormalBetType).toBeNull();
      expect(component.betIdsComponent.clearBetId).toHaveBeenCalled();
    });
  });

  describe('changeAbnormalBetType', () => {
    it('should set abnormalBetType to null when includeMainParlay is true', () => {
      // Arrange
      component.includeMainParlay = true;
      component.abnormalBetType = '0';

      // Act
      component.changeAbnormalBetType();

      // Assert
      expect(component.abnormalBetType).toBeNull();
    });

    it('should set abnormalBetType to "0" when includeMainParlay is false', () => {
      // Arrange
      component.includeMainParlay = false;
      component.abnormalBetType = null;

      // Act
      component.changeAbnormalBetType();

      // Assert
      expect(component.abnormalBetType).toBe('0');
    });
  });
});
