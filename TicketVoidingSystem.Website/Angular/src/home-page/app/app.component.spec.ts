import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { CommonService } from '../../utility/services/common.service';
import { AppComponent } from './app.component';

jest.mock('../../utility/services/signal-r.service.native');
jest.mock('../../utility/services/common.service');

describe('AppComponent', () => { 
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent)
      .dontMock(NgbModule)
      .provideMock({ provide: SignalRService, useValue: { initializeConnection: jest.fn() } })
      .provideMock({ provide: CommonService, useValue: { 
        getIssueTypePermissionList: jest.fn()
      }});
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
      getIssueTypePermissionList: jest.fn().mockResolvedValue([
        { issueTypeId: 1, issueTypeName: 'Test Issue 1' },
        { issueTypeId: 2, issueTypeName: 'Test Issue 2' }
      ])
    };
    
    (instance as any).signalRService = mockSignalRService;
    (instance as any).commonService = mockCommonService;

    await instance.ngOnInit();

    expect(mockCommonService.getIssueTypePermissionList).toHaveBeenCalled();
    expect(mockSignalRService.initializeConnection).toHaveBeenCalled();
    expect(instance.issueTypePermissionList).toEqual([
      { issueTypeId: 1, issueTypeName: 'Test Issue 1' },
      { issueTypeId: 2, issueTypeName: 'Test Issue 2' }
    ]);
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
    instance.issueTypePermissionList = [
      { issueTypeId: 1, issueTypeName: 'Danger Accepted' },
      { issueTypeId: 2, issueTypeName: 'Wrong Odds' },
      { issueTypeId: 3, issueTypeName: 'Wrong Score' }
    ];

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.btn');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toContain('Danger Accepted');
    expect(buttons[1].textContent).toContain('Wrong Odds');
    expect(buttons[2].textContent).toContain('Wrong Score');
  });

  it('should not display any buttons when issueTypePermissionList is empty', async () => {
    const { fixture, instance } = await shallow.render();
    
    // Set empty data on the component instance
    instance.issueTypePermissionList = [];

    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.btn');
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