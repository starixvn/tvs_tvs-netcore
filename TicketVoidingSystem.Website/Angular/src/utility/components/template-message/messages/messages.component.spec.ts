import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { MessagesComponent } from './messages.component';
import { Message } from './message';

class Helper {
  static readonly fakeMessage = {
    contentEnglish: 'Test @@ message',
    contentChineseTraditional: 'Test @@ message',
    contentChineseSimplified: 'Test @@ message',
    contentNewChineseSimplified: 'Test @@ message',
    contentThai: 'Test @@ message',
    contentKorean: 'Test @@ message',
    contentJapanese: 'Test @@ message',
    contentItalian: 'Test @@ message',
    contentSpanish: 'Test @@ message',
    isTVSAddOrEditPage: false
  } as Message;
}

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    component.message = new Message();
    component.messageChange.emit = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isShowMessages).toBeUndefined();
    expect(component.message).toBeInstanceOf(Message);
    expect(component.isShowOtherLanguage).toBeFalsy();
    expect(component.marginX).toBe(10);
    expect(component.isShowContentMessage).toBeFalsy();
  });

  it('should validate main language content correctly', () => {
    // Arrange
    component.message = Helper.fakeMessage;

    // Act
    const result = component.checkValidationForMainLanguage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should fail validation when English content is empty', () => {
    // Arrange
    component.message = { ...Helper.fakeMessage, contentEnglish: '' };

    // Act
    const result = component.checkValidationForMainLanguage();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should fail validation when English content does not contain @@', () => {
    // Arrange
    component.message = { ...Helper.fakeMessage, contentEnglish: 'Test message' };

    // Act
    const result = component.checkValidationForMainLanguage();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should validate other language content correctly', () => {
    // Arrange
    component.message = Helper.fakeMessage;

    // Act
    const result = component.checkValidationForOtherLanguage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should fail validation when Thai content does not contain @@', () => {
    // Arrange
    component.message = { ...Helper.fakeMessage, contentThai: 'Test message' };

    // Act
    const result = component.checkValidationForOtherLanguage();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should clear data correctly', () => {
    // Arrange
    component.message = Helper.fakeMessage;

    // Act
    component.clearData();

    // Assert
    expect(component.message).toBeInstanceOf(Message);
    expect(component.message.contentEnglish).toBeUndefined();
  });

  it('should emit message change event', () => {
    // Arrange
    component.message = Helper.fakeMessage;

    // Act
    component.changedMessage();

    // Assert
    expect(component.messageChange.emit).toHaveBeenCalledWith(component.message);
  });

  it('should return correct styles for TVS add/edit page', () => {
    // Arrange
    component.message = { ...Helper.fakeMessage, isTVSAddOrEditPage: true };

    // Act
    const styles = component.getStyles();

    // Assert
    expect(styles).toBe('');
  });

  it('should return correct styles for non-TVS page', () => {
    // Arrange
    component.message = { ...Helper.fakeMessage, isTVSAddOrEditPage: false };

    // Act
    const styles = component.getStyles();

    // Assert
    expect(styles).toBe('margin: 0 10px;');
  });

  it('should toggle show content message', () => {
    // Arrange
    component.isShowContentMessage = false;

    // Act
    component.changedShowContentMessage();

    // Assert
    expect(component.isShowContentMessage).toBeTruthy();

    // Act again
    component.changedShowContentMessage();

    // Assert
    expect(component.isShowContentMessage).toBeFalsy();
  });

  it('should check content of other language correctly', () => {
    // Arrange
    const validContent = 'Test @@ message';
    const invalidContent = 'Test message';

    // Act & Assert
    expect(component.checkContentOfOtherLanguage(validContent)).toBeFalsy();
    expect(component.checkContentOfOtherLanguage(invalidContent)).toBeTruthy();
  });

  it('should perform full validation check', () => {
    // Arrange
    component.message = Helper.fakeMessage;
    jest.spyOn(component, 'checkValidationForMainLanguage').mockReturnValue(true);
    jest.spyOn(component, 'checkValidationForOtherLanguage').mockReturnValue(true);

    // Act
    const result = component.checkValidation();

    // Assert
    expect(result).toBeTruthy();
    expect(component.checkValidationForMainLanguage).toHaveBeenCalled();
    expect(component.checkValidationForOtherLanguage).toHaveBeenCalled();
  });
}); 