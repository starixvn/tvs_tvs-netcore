import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { IssueType } from 'src/utility/models/issue-type.model';
import { CommonService } from '../../utility/services/common.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

jest.mock('../../utility/services/signal-r.service.native');
jest.mock('../../utility/services/common.service');
jest.mock('./app.service');
jest.mock('../../utility/constants/issue-type-icon.constant', () => ({
  IssueTypeIconConstant: {
    getIconClassFromHomePage: jest.fn().mockReturnValue('icon-test')
  }
}));
jest.mock('../../utility/constants/issue-type.constant', () => ({
  IssueTypeConstant: {
    NAVIGATE_ADD_REQUEST: new Map([
      ['1', 'TicketVoidingSystem/DangerAccepted/Add'],
      ['2', 'TicketVoidingSystem/WrongOdds/Add']
    ])
  }
}));

// mock dayjs
jest.mock('dayjs', () => {
  const mockDayjs = () => ({
    tz: jest.fn().mockReturnValue({
      format: jest.fn().mockReturnValue('January')
    })
  });

  // Add extend method to the mock
  mockDayjs.extend = jest.fn();

  return mockDayjs;
});
class Helper {
  static getIssueTypePermissionList() {
    return [
      { issueTypeId: 1, issueTypeName: 'Test Issue 1' },
      { issueTypeId: 2, issueTypeName: 'Test Issue 2' }
    ] as IssueType[];
  }
  static getIssueTypeHomePage() {
    return [
      { issueTypeId: 1, totalRequest: 10 },
      { issueTypeId: 2, totalRequest: 20 }
    ];
  }
}

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

    beforeEach(() => {
    shallow = new Shallow(AppComponent)
      .dontMock(NgbModule)
      .provideMock({ provide: SignalRService, useValue: { initializeConnection: jest.fn() } })
      .provideMock({ provide: CommonService, useValue: {
        getIssueTypePermissionList: jest.fn().mockReturnValue(Helper.getIssueTypePermissionList())
      }})
      .provideMock({ provide: AppService, useValue: {
        getIssueTypeHomePage: jest.fn().mockReturnValue(Helper.getIssueTypeHomePage())
      }})
      .provideMock({ provide: HttpClient, useValue: {} });
  });

  it('#AppComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should call #getIssueTypePermissionList and #initializeConnection', async () => {
    const { instance } = await shallow.render();

    // Mock the injected services
    const mockSignalRService = { initializeConnection: jest.fn() };
    const mockCommonService = {
      getIssueTypePermissionList: jest.fn().mockResolvedValue(Helper.getIssueTypePermissionList())
    };
    const mockAppService = {
      getIssueTypeHomePage: jest.fn().mockResolvedValue(Helper.getIssueTypeHomePage())
    };

    (instance as any).signalRService = mockSignalRService;
    (instance as any).commonService = mockCommonService;
    (instance as any).appService = mockAppService;

    await instance.ngOnInit();

    expect(mockCommonService.getIssueTypePermissionList).toHaveBeenCalled();
    expect(mockSignalRService.initializeConnection).toHaveBeenCalled();
    expect(mockAppService.getIssueTypeHomePage).toHaveBeenCalled();

    // Check that issueTypes are properly mapped with icons
    expect(instance.issueTypes).toHaveLength(2);
    expect(instance.issueTypes[0].issueTypeId).toBe(1);
    expect(instance.issueTypes[0].issueTypeName).toBe('Test Issue 1');
    expect(instance.issueTypes[0].totalRequest).toBe(10);
    expect(instance.issueTypes[1].issueTypeId).toBe(2);
    expect(instance.issueTypes[1].issueTypeName).toBe('Test Issue 2');
    expect(instance.issueTypes[1].totalRequest).toBe(20);
  });

  it('#ngOnInit should handle error when getting issue type permission list', async () => {
    const { instance } = await shallow.render();

    const mockSignalRService = { initializeConnection: jest.fn() };
    const mockCommonService = {
      getIssueTypePermissionList: jest.fn().mockRejectedValue(new Error('API Error'))
    };

    (instance as any).signalRService = mockSignalRService;
    (instance as any).commonService = mockCommonService;

    await expect(instance.ngOnInit()).rejects.toThrow('API Error');
  });

  it('#navigateToIssueType should open window with correct URL when issue type exists', async () => {
    const { instance } = await shallow.render();

    // Mock document.body.getAttribute
    const mockGetAttribute = jest.fn().mockReturnValue('http://localhost:4200/');
    Object.defineProperty(document.body, 'getAttribute', {
      value: mockGetAttribute,
      writable: true
    });

    // Mock window.open
    const mockWindowOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockWindowOpen,
      writable: true
    });

    // Test with existing issue type
    const issueTypeId = 1; // DANGER_ACCEPTED
    instance.navigateToIssueType(issueTypeId);

    expect(mockGetAttribute).toHaveBeenCalledWith('root-url');
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'http://localhost:4200/TicketVoidingSystem/DangerAccepted/Add',
      '_blank'
    );
  });

  it('#navigateToIssueType should not open window when issue type does not exist', async () => {
    const { instance } = await shallow.render();

    // Mock document.body.getAttribute
    const mockGetAttribute = jest.fn().mockReturnValue('http://localhost:4200/');
    Object.defineProperty(document.body, 'getAttribute', {
      value: mockGetAttribute,
      writable: true
    });

    // Mock window.open
    const mockWindowOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockWindowOpen,
      writable: true
    });

    // Test with non-existing issue type - use a number that doesn't exist in IssueTypeConstant
    const issueTypeId = 999;
    instance.navigateToIssueType(issueTypeId);

    // When issue type doesn't exist, url will be undefined, so getAttribute won't be called
    expect(mockGetAttribute).not.toHaveBeenCalled();
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it('#navigateToIssueType should handle when root-url attribute is null', async () => {
    const { instance } = await shallow.render();

    // Mock document.body.getAttribute to return null
    const mockGetAttribute = jest.fn().mockReturnValue(null);
    Object.defineProperty(document.body, 'getAttribute', {
      value: mockGetAttribute,
      writable: true
    });

    // Mock window.open
    const mockWindowOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockWindowOpen,
      writable: true
    });

    const issueTypeId = 1; // DANGER_ACCEPTED
    instance.navigateToIssueType(issueTypeId);

    expect(mockGetAttribute).toHaveBeenCalledWith('root-url');
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'nullTicketVoidingSystem/DangerAccepted/Add',
      '_blank'
    );
  });

  it('should display issue types in template when issueTypePermissionList is populated', async () => {
    const { fixture, instance } = await shallow.render();

    // Set the data on the component instance
    instance.issueTypes = [
      { issueTypeId: 1, issueTypeName: 'Danger Accepted', totalRequest: 10, icon: 'icon-danger-accepted' },
      { issueTypeId: 2, issueTypeName: 'Wrong Odds', totalRequest: 20, icon: 'icon-wrong-odds' },
      { issueTypeId: 3, issueTypeName: 'Wrong Score', totalRequest: 30, icon: 'icon-wrong-score' }
    ];

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.issue-type-card');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toContain('Danger Accepted');
    expect(buttons[1].textContent).toContain('Wrong Odds');
    expect(buttons[2].textContent).toContain('Wrong Score');
  });

  it('should not display any buttons when issueTypePermissionList is empty', async () => {
    const { fixture, instance } = await shallow.render();

    // Set empty data on the component instance
    instance.issueTypes = [];

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.issue-type-card');
    expect(buttons.length).toBe(0);
  });

  it('should display title and subtitle correctly', async () => {
    const { fixture } = await shallow.render();

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h2.title');
    const subtitle = fixture.nativeElement.querySelector('.subtitle');

    expect(title.textContent).toContain('Ticket Voiding System');
    expect(subtitle.textContent).toContain('Most Used Issue Types');
  });
});