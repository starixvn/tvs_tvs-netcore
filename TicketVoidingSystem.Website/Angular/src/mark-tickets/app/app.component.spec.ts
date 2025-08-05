import { ComponentFixture } from '@angular/core/testing';
import { Shallow } from 'shallow-render';
import { CommonService } from '../../utility/services/common.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { DataPermission } from './models/result.model';

// Mock window.location.search
Object.defineProperty(window, 'location', {
  value: {
    search: ''
  },
  writable: true
});

class Helper {
  static readonly mockDataPermission = {
    isReadMarkTickets: true,
    isHostMarkTickets: true
  } as DataPermission;

  static readonly mockSignalRService = {
    initializeConnection: jest.fn().mockResolvedValue(undefined)
  };

  static readonly mockCommonService = {
    logAccessFunction: jest.fn().mockResolvedValue(true)
  };

  static readonly mockAppService = {
    getDataPermission: jest.fn().mockResolvedValue(Helper.mockDataPermission)
  };
}

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let signalRService: SignalRService;
  let appService: AppService;
  let commonService: CommonService;

  beforeEach(async () => {
    shallow = new Shallow(AppComponent)
      .mock(SignalRService, Helper.mockSignalRService)
      .mock(AppService, Helper.mockAppService)
      .mock(CommonService, Helper.mockCommonService);

    const result = await shallow.render();
    component = result.instance;
    fixture = result.fixture;

    // Get services from injector
    signalRService = fixture.debugElement.injector.get(SignalRService);
    appService = fixture.debugElement.injector.get(AppService);
    commonService = fixture.debugElement.injector.get(CommonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Reset window.location.search
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true
    });
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct title', () => {
      expect(component.title).toBe('Mark Ticket');
    });
  });

  describe('ngOnInit', () => {
    it('should initialize component correctly', async () => {
      // Arrange
      const mockDataPermission = Helper.mockDataPermission;
      jest.spyOn(appService, 'getDataPermission').mockResolvedValue(mockDataPermission);
      jest.spyOn(signalRService, 'initializeConnection').mockResolvedValue(undefined);

      // Act
      await component.ngOnInit();

      // Assert
      expect(appService.getDataPermission).toHaveBeenCalled();
      expect(signalRService.initializeConnection).toHaveBeenCalled();
      expect(component.dataPermission).toEqual(mockDataPermission);
    });

    it('should set isExternalUrl to true when URL parameter is 1', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { search: '?isExternalUrl=1' },
        writable: true
      });

      // Act
      await component.ngOnInit();

      // Assert
      expect(component.isExternalUrl).toBe(true);
    });

    it('should set isExternalUrl to false when URL parameter is not 1', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { search: '?isExternalUrl=0' },
        writable: true
      });

      // Act
      await component.ngOnInit();

      // Assert
      expect(component.isExternalUrl).toBe(false);
    });
  });

  describe('changeTab', () => {
    it('should change current tab and log access', async () => {
      // Arrange
      const tab = '0';
      jest.spyOn(component, 'logAccessTab').mockResolvedValue(undefined);

      // Act
      await component.changeTab(tab);

      // Assert
      expect(component.currentTab).toBe(tab);
      expect(component.logAccessTab).toHaveBeenCalledWith(tab);
    });

    it('should handle multiple tab changes', async () => {
      // Arrange
      const tabs = ['0', '1', '2', '3'];
      jest.spyOn(component, 'logAccessTab').mockResolvedValue(undefined);

      // Act & Assert
      for (const tab of tabs) {
        await component.changeTab(tab);
        expect(component.currentTab).toBe(tab);
      }
    });
  });

  describe('Tab Validation Methods', () => {
    describe('isMarkOrUnmarkTab', () => {
      it('should return true for tab 0', () => {
        // Arrange
        component.currentTab = '0';

        // Act
        const result = component.isMarkOrUnmarkTab();

        // Assert
        expect(result).toBe(true);
      });

      it('should return true for tab 1', () => {
        // Arrange
        component.currentTab = '1';

        // Act
        const result = component.isMarkOrUnmarkTab();

        // Assert
        expect(result).toBe(true);
      });

      it('should return false for other tabs', () => {
        // Arrange
        const invalidTabs = ['2', '3', '4', '5'];

        // Act & Assert
        invalidTabs.forEach(tab => {
          component.currentTab = tab;
          expect(component.isMarkOrUnmarkTab()).toBe(false);
        });
      });
    });

    describe('isLogTab', () => {
      it('should return true for tab 2', () => {
        // Arrange
        component.currentTab = '2';

        // Act
        const result = component.isLogTab();

        // Assert
        expect(result).toBe(true);
      });

      it('should return false for other tabs', () => {
        // Arrange
        const invalidTabs = ['0', '1', '3', '4'];

        // Act & Assert
        invalidTabs.forEach(tab => {
          component.currentTab = tab;
          expect(component.isLogTab()).toBe(false);
        });
      });
    });

    describe('isConfirmAutoUnmarkTab', () => {
      it('should return true for tab 3', () => {
        // Arrange
        component.currentTab = '3';

        // Act
        const result = component.isConfirmAutoUnmarkTab();

        // Assert
        expect(result).toBe(true);
      });

      it('should return false for other tabs', () => {
        // Arrange
        const invalidTabs = ['0', '1', '2', '4'];

        // Act & Assert
        invalidTabs.forEach(tab => {
          component.currentTab = tab;
          expect(component.isConfirmAutoUnmarkTab()).toBe(false);
        });
      });
    });
  });

  describe('logAccessTab', () => {
    it('should log access for MarkTicket tab', async () => {
      // Arrange
      const tab = '0';
      jest.spyOn(component, 'logAccessTabByType').mockResolvedValue(undefined);

      // Act
      await component.logAccessTab(tab);

      // Assert
      expect(component.logAccessTabByType).toHaveBeenCalledWith(tab, 'MarkTicket');
    });

    it('should log access for UnmarkTicket tab', async () => {
      // Arrange
      const tab = '1';
      jest.spyOn(component, 'logAccessTabByType').mockResolvedValue(undefined);

      // Act
      await component.logAccessTab(tab);

      // Assert
      expect(component.logAccessTabByType).toHaveBeenCalledWith(tab, 'UnmarkTicket');
    });

    it('should log access for UserLog tab', async () => {
      // Arrange
      const tab = '2';
      jest.spyOn(component, 'logAccessTabByType').mockResolvedValue(undefined);

      // Act
      await component.logAccessTab(tab);

      // Assert
      expect(component.logAccessTabByType).toHaveBeenCalledWith(tab, 'UserLog');
    });

    it('should log access for ConfirmAutoUnmark tab', async () => {
      // Arrange
      const tab = '3';
      jest.spyOn(component, 'logAccessTabByType').mockResolvedValue(undefined);

      // Act
      await component.logAccessTab(tab);

      // Assert
      expect(component.logAccessTabByType).toHaveBeenCalledWith(tab, 'ConfirmAutoUnmark');
    });

    it('should not log access for invalid tab', async () => {
      // Arrange
      const tab = '4';
      jest.spyOn(component, 'logAccessTabByType').mockResolvedValue(undefined);

      // Act
      await component.logAccessTab(tab);

      // Assert
      expect(component.logAccessTabByType).not.toHaveBeenCalled();
    });
  });

  describe('logAccessTabByType', () => {
    it('should log access on first visit', async () => {
      // Arrange
      const tab = '0';
      const tabName = 'MarkTicket';
      jest.spyOn(commonService, 'logAccessFunction').mockResolvedValue(true);

      // Act
      await component.logAccessTabByType(tab, tabName);

      // Assert
      expect(commonService.logAccessFunction).toHaveBeenCalledWith(`MarkTickets/${tabName}`);
      expect(component.accessTabCount.get(tab)).toBe(1);
    });

    it('should not log access on subsequent visits', async () => {
      // Arrange
      const tab = '0';
      const tabName = 'MarkTicket';
      component.accessTabCount.set(tab, 1);
      jest.spyOn(commonService, 'logAccessFunction').mockResolvedValue(true);

      // Act
      await component.logAccessTabByType(tab, tabName);

      // Assert
      expect(commonService.logAccessFunction).not.toHaveBeenCalled();
      expect(component.accessTabCount.get(tab)).toBe(1);
    });

    it('should not increment count when logging fails', async () => {
      // Arrange
      const tab = '0';
      const tabName = 'MarkTicket';
      jest.spyOn(commonService, 'logAccessFunction').mockResolvedValue(false);

      // Act
      await component.logAccessTabByType(tab, tabName);

      // Assert
      expect(commonService.logAccessFunction).toHaveBeenCalledWith(`MarkTickets/${tabName}`);
      expect(component.accessTabCount.get(tab)).toBeUndefined();
    });
  });
});