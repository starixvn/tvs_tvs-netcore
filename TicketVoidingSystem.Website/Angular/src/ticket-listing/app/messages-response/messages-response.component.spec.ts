import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesResponseComponent } from './messages-response.component';
import { CommonModule } from '@angular/common';
import { SanitizeHtmlPipe } from '../../../utility/modules/sanitize-html.pipe';
import { AmendmentReponse } from '../models/query.model';
import { By } from '@angular/platform-browser';

class Helper {
  static readonly mockAmendmentResponse = {
    code: 0,
    message: 'Success',
    isChinaView: false,
    isCanReSend: false,
    specialPlatform: null,
    isSuccessful: true
  } as AmendmentReponse;

  static readonly mockAmendmentResponseWithResend = {
    code: 1,
    message: 'Warning',
    isChinaView: false,
    isCanReSend: true,
    specialPlatform: null,
    isSuccessful: false
  } as AmendmentReponse;

  static readonly mockMessagesResponse = {
    header: 'Test Header',
    body: 'Test Body',
    isShow: true,
    results: [Helper.mockAmendmentResponse],
    open: jest.fn(),
    close: jest.fn()
  };

  static readonly mockMessagesResponseWithResend = {
    header: 'Test Header',
    body: 'Test Body',
    isShow: true,
    results: [Helper.mockAmendmentResponseWithResend],
    open: jest.fn(),
    close: jest.fn()
  };
}

describe('MessagesResponseComponent', () => {
  let component: MessagesResponseComponent;
  let fixture: ComponentFixture<MessagesResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, SanitizeHtmlPipe, MessagesResponseComponent],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesResponseComponent);
    component = fixture.componentInstance;
    component.messagesResponse = Helper.mockMessagesResponse;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onClickResendData should emit resendDataEvent with result', () => {
    // Arrange
    component.resendDataEvent.emit = jest.fn();
    const result = Helper.mockAmendmentResponse;

    // Act
    component.onClickResendData(result);

    // Assert
    expect(component.resendDataEvent.emit).toHaveBeenCalledWith(result);
  });

  it('should display header correctly', () => {
    // Arrange
    component.messagesResponse = Helper.mockMessagesResponse;
    fixture.detectChanges();

    // Act
    const headerElement = fixture.debugElement.query(By.css('.messages-results-header'));

    // Assert
    expect(headerElement.nativeElement.textContent).toContain('Test Header');
  });

  it('should show resend button when isCanReSend is true', () => {
    // Arrange
    component.messagesResponse = Helper.mockMessagesResponseWithResend;
    fixture.detectChanges();

    // Act
    const resendButton = fixture.debugElement.query(By.css('.btn-resend'));

    // Assert
    expect(resendButton).toBeTruthy();
  });

  it('should not show resend button when isCanReSend is false', () => {
    // Arrange
    component.messagesResponse = Helper.mockMessagesResponse;
    fixture.detectChanges();

    // Act
    const resendButton = fixture.debugElement.query(By.css('.btn-resend'));

    // Assert
    expect(resendButton).toBeFalsy();
  });

  it('should display success message correctly', () => {
    // Arrange
    component.messagesResponse = Helper.mockMessagesResponse;
    fixture.detectChanges();

    // Act
    const successElement = fixture.debugElement.query(By.css('.success'));

    // Assert
    expect(successElement.nativeElement.textContent).toContain('Success');
  });

  it('should display fail message correctly', () => {
    // Arrange
    component.messagesResponse = Helper.mockMessagesResponseWithResend;
    fixture.detectChanges();

    // Act
    const failElement = fixture.debugElement.query(By.css('.fail'));

    // Assert
    expect(failElement.nativeElement.textContent).toContain('Warning');
  });
});
