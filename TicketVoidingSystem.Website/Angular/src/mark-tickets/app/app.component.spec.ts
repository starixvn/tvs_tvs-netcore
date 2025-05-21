import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../utility/modules/testing.module';
import { CommonService } from '../../utility/services/common.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { DataPermission } from './models/result.model';

jest.mock('../../utility/services/signal-r.service.native');

class Helper {
  static readonly mockSignalRService = {
    initializeConnection: jest.fn()
  };
  static readonly mockCommonService = {
    logAccessFunction: jest.fn().mockResolvedValue(true),
    getBalanceUpZoneManila: jest.fn().mockResolvedValue({
      balanceUpDay: new Date('2020-01-16').toISOString(),
      moveBetsDay: new Date('2020-01-26').toISOString(),
      balanceUpNgbDate: { year: 2020, month: 1, day: 16 },
      moveBetsNgbDate: { year: 2020, month: 1, day: 26 }
    }),
    getCurrencies: jest.fn().mockResolvedValue([
      { id: 1, currencyCode: 'USD' },
      { id: 2, currencyCode: 'EUR' }
    ]),
    getGroupLicensees: jest.fn().mockResolvedValue([])
  };
  static readonly mockAppService = {
    getDataPermission: jest.fn().mockResolvedValue(new DataPermission())
  };
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        { provide: SignalRService, useValue: Helper.mockSignalRService },
        { provide: CommonService, useValue: Helper.mockCommonService },
        { provide: AppService, useValue: Helper.mockAppService }
      ]
    }).compileComponents();

    // Setup document.body
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.isExternalUrl = false;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Tab Navigation', () => {
    it('should render mark-unmark-ticket component when tab is 0', async () => {
      // Arrange
      component.currentTab = '';

      // Act
      await component.changeTab('0');

      // Assert
      expect(component.currentTab).toBe('0');
    });

    it('should render mark-unmark-ticket component when tab is 1', async () => {
      // Arrange
      component.currentTab = '';
      
      // Act
      await component.changeTab('1');

      // Assert
      expect(component.currentTab).toBe('1');
    });

    it('should render user-log component when tab is 2', async () => {
      // Arrange
      component.currentTab = '';

      // Act
      await component.changeTab('2');

      // Assert
      expect(component.currentTab).toBe('2');
    });

    it('should render confirm-auto-unmark component when tab is 3', async () => {
      // Arrange
      component.currentTab = '';

      // Act
      await component.changeTab('3');
      fixture.detectChanges();

      // Assert
      expect(component.currentTab).toBe('3');
    });
  });

  describe('Tab Validation', () => {
    describe('isConfirmAutoUnmarkTab', () => {
      it('should return true when currentTab is 3', () => {
        // Arrange
        component.currentTab = '3';

        // Act
        const result = component.isConfirmAutoUnmarkTab();

        // Assert
        expect(result).toBe(true);
      });

      it('should return false when currentTab is not 3', () => {
        // Arrange
        component.currentTab = '4';

        // Act
        const result = component.isConfirmAutoUnmarkTab();

        // Assert
        expect(result).toBeFalsy();
      });
    });

    describe('isLogTab', () => {
      it('should return true when currentTab is 2', () => {
        // Arrange
        component.currentTab = '2';
        // Act
        const result = component.isLogTab();

        // Assert
        expect(result).toBe(true);
      });

      it('should return false when currentTab is not 2', () => {
        // Arrange
        component.currentTab = '4';

        // Act
        const result = component.isLogTab();

        // Assert
        expect(result).toBeFalsy();
      });
    });

    describe('isMarkOrUnmarkTab', () => {
      it('should return true when currentTab is 0', () => {
        // Arrange
        component.currentTab = '0';

        // Act
        const result = component.isMarkOrUnmarkTab();

        // Assert
        expect(result).toBe(true);
      });

      it('should return true when currentTab is 1', () => {
        // Arrange
        component.currentTab = '1';

        // Act
        const result = component.isMarkOrUnmarkTab();

        // Assert
        expect(result).toBe(true);
      });

      it('should return false when currentTab is not 0 or 1', () => {
        // Arrange
        component.currentTab = '4';

        // Act
        const result = component.isMarkOrUnmarkTab();

        // Assert
        expect(result).toBeFalsy();
      });
    });
  });

  describe('Initialization', () => {
    it('should set isExternalUrl to true when URL parameter is 1', async () => {
      // Arrange
      jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue('1');
      component.isExternalUrl = false;

      // Act
      await component.ngOnInit();

      // Assert
      expect(component.isExternalUrl).toBe(true);
    });
  });
});