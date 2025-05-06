import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../utility/modules/testing.module';
import { AppComponent } from './app.component';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { InitializedRequestModel } from './add-request/models/request.model';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class Helper {
  static readonly fakeInitializedRequestModel: InitializedRequestModel = {
    issueTypeId: '1',
    subIssueTypeId: '2',
    actionId: '3',
    isTest: true,
    transIds: '123,456'
  };
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let signalRService: SignalRService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        SignalRService,
        ToastrService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    signalRService = fixture.debugElement.injector.get(SignalRService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when no init data', async () => {
    // Arrange
    document.getElementById = jest.fn().mockReturnValue(null);
    signalRService.initializeConnection = jest.fn();

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.isExternalUrl).toBeFalsy();
    expect(signalRService.initializeConnection).toHaveBeenCalled();
  });

  it('should initialize with external data when init data exists', async () => {
    // Arrange
    const mockElement = {
      value: JSON.stringify(Helper.fakeInitializedRequestModel)
    };
    document.getElementById = jest.fn().mockReturnValue(mockElement);
    signalRService.initializeConnection = jest.fn();

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.isExternalUrl).toBeTruthy();
    expect(component.model.filter.issueTypeId).toBe(Helper.fakeInitializedRequestModel.issueTypeId);
    expect(component.model.filter.subIssueTypeId).toBe(Helper.fakeInitializedRequestModel.subIssueTypeId);
    expect(component.model.filter.action).toBe(Helper.fakeInitializedRequestModel.actionId);
    expect(component.model.filter.isTest).toBe(Helper.fakeInitializedRequestModel.isTest);
    expect(component.model.abnormalBetModel.transIds).toEqual(Helper.fakeInitializedRequestModel.transIds);
    expect(signalRService.initializeConnection).toHaveBeenCalled();
  });

  it('should handle invalid JSON in init data', async () => {
    // Arrange
    const mockElement = {
      value: 'invalid json'
    };
    document.getElementById = jest.fn().mockReturnValue(mockElement);
    signalRService.initializeConnection = jest.fn();

    // Act & Assert
    await expect(component.ngOnInit()).rejects.toThrow();
    expect(signalRService.initializeConnection).not.toHaveBeenCalled();
  });

  it('should map model correctly', () => {
    // Arrange
    const requestModel = Helper.fakeInitializedRequestModel;

    // Act
    component['mapModel'](requestModel);

    // Assert
    expect(component.model.filter.issueTypeId).toBe(requestModel.issueTypeId);
    expect(component.model.filter.subIssueTypeId).toBe(requestModel.subIssueTypeId);
    expect(component.model.filter.action).toBe(requestModel.actionId);
    expect(component.model.filter.isTest).toBe(requestModel.isTest);
    expect(component.model.abnormalBetModel.transIds).toEqual(requestModel.transIds);
  });
});
