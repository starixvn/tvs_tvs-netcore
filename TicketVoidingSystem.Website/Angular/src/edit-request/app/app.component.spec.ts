import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../utility/modules/testing.module';
import { AppComponent } from './app.component';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppService } from './app.service';
import { LogInfoService } from '../../add-request-new/events/services/edit-request/log-info.service';
import { ObjectService } from '../../add-request-new/events/services/edit-request/object.service';
import { RequestDetailViewModel } from './request.model';
import { RequestModel } from '../../add-request/app/add-request/models/request.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appService: AppService;
  let signalRService: SignalRService;
  let logInfoService: LogInfoService;
  let objectService: ObjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        AppService,
        SignalRService,
        LogInfoService,
        ObjectService,
        ToastrService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appService = TestBed.inject(AppService);
    signalRService = TestBed.inject(SignalRService);
    logInfoService = TestBed.inject(LogInfoService);
    objectService = TestBed.inject(ObjectService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.detailViewModel).toBeTruthy();
    expect(component.requestModel).toBeTruthy();
    expect(component.primitiveProperty).toBeTruthy();
    expect(component.isBlock).toBeFalsy();
  });

  it('should handle ngOnInit correctly', async () => {
    // Arrange
    const mockRequestId = 123;
    const mockDetailViewModel = new RequestDetailViewModel();
    const mockPrimitiveProperty = new PrimitiveProperty();
    const mockRequestModel = new RequestModel();

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: `http://localhost:4200/edit-request/${mockRequestId}` },
      writable: true
    });

    // Mock service methods
    jest.spyOn(appService, 'getRequestById').mockResolvedValue(mockDetailViewModel);
    jest.spyOn(objectService, 'getPrimitiveProperty').mockReturnValue(mockPrimitiveProperty);
    jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue(undefined);
    jest.spyOn(objectService, 'mapRequestModel').mockImplementation(() => {});
    jest.spyOn(signalRService, 'initializeConnection').mockImplementation(() => Promise.resolve());

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(appService.getRequestById).toHaveBeenCalledWith(mockRequestId);
    expect(objectService.getPrimitiveProperty).toHaveBeenCalledWith(mockDetailViewModel, mockRequestId);
    expect(logInfoService.getLogInfo).toHaveBeenCalledWith(mockPrimitiveProperty, mockDetailViewModel);
    expect(objectService.mapRequestModel).toHaveBeenCalledWith(mockRequestModel, mockDetailViewModel, mockPrimitiveProperty);
    expect(signalRService.initializeConnection).toHaveBeenCalled();
  });

  it('should handle error in ngOnInit', async () => {
    // Arrange
    const mockRequestId = 123;
    Object.defineProperty(window, 'location', {
      value: { href: `http://localhost:4200/edit-request/${mockRequestId}` },
      writable: true
    });

    jest.spyOn(appService, 'getRequestById').mockRejectedValue(new Error('Test error'));

    // Act & Assert
    await expect(component.ngOnInit()).rejects.toThrow('Test error');
    expect(component.isBlock).toBeTruthy();
  });

  it('should handle invalid URL format', async () => {
    // Arrange
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost:4200/invalid-url' },
      writable: true
    });

    // Act & Assert
    await expect(component.ngOnInit()).rejects.toThrow();
  });
});
