import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationMessage } from '../../../../add-request-new/models/get-log-info.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { StaticService } from '../../../../utility/services/static.service';
import { ModalService } from '../../modal/modal.service';
import { LogInfoMessageComponent } from './log-info-message.component';

class Helper {
  static readonly fakeValidationMessages = [
    {
      reason: 'Test error message',
      isError: true,
      isShowPopup: false,
      requestId: 0,
      transIds: ''
    },
    {
      reason: 'Test warning message',
      isError: false,
      isShowPopup: false,
      requestId: 0,
      transIds: ''
    },
    {
      reason: 'Test warning message with popup',
      isError: false,
      isShowPopup: true,
      requestId: 123,
      transIds: 'TXN001,TXN002'
    }
  ] as ValidationMessage[];
}

describe('LogInfoMessageComponent', () => {
  let component: LogInfoMessageComponent;
  let fixture: ComponentFixture<LogInfoMessageComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ModalService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInfoMessageComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call StaticService.openPopupTransIds with correct parameters', () => {
    // Arrange
    const requestId = 456;
    const transIds = 'TXN003,TXN004';
    StaticService.openPopupTransIds = jest.fn();

    // Act
    component.openPopupTransIds(requestId, transIds);

    // Assert
    expect(StaticService.openPopupTransIds).toHaveBeenCalledWith(requestId, transIds, modalService);
  });

  it('should not call openPopupTransIds when warning message without popup is clicked', () => {
    // Arrange
    component.messages = [Helper.fakeValidationMessages[1]]; // Warning message without popup
    component.openPopupTransIds = jest.fn();
    fixture.detectChanges();

    // Act
    const compiled = fixture.nativeElement;
    const warningElement = compiled.querySelector('.warning-text');
    warningElement.click();

    // Assert
    expect(component.openPopupTransIds).not.toHaveBeenCalled();
  });
});
