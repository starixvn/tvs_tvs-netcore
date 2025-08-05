import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Result } from 'src/utility/models/result';
import { TestingModule } from '../../../utility/modules/testing.module';
import { MessagesResult } from './messages-result';
import { MessagesResultComponent } from './messages-result.component';

describe('MessagesResultComponent', () => {
  let component: MessagesResultComponent;
  let fixture: ComponentFixture<MessagesResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesResultComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not process empty messages result', () => {
    // Arrange
    const emptyResult = new MessagesResult();
    emptyResult.results = [];

    // Act
    component.ngOnChanges({
      messagesResult: {
        currentValue: emptyResult,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(emptyResult.results).toEqual([]);
  });

  it('should not process null messages result', () => {
    // Arrange
    const nullResult = null;

    // Act
    component.ngOnChanges({
      messagesResult: {
        currentValue: nullResult,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(nullResult).toBeNull();
  });

  it('should replace error message for lock match error codes', () => {
    // Arrange
    const result = new MessagesResult();
    result.results = [
      { errorCode: 1000000, errorMsg: 'Original error message' },
      { errorCode: 101, errorMsg: 'Another error message' },
      { errorCode: 999, errorMsg: 'Non-lock match error' }
    ] as unknown as Result<string>[];
    component.messagesResult = result;

    // Act
    component.ngOnChanges({
      messagesResult: {
        currentValue: result,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.messagesResult.results[0].errorMsg).toBe('Some tickets cannot be processed because: Original error message');
    expect(component.messagesResult.results[1].errorMsg).toBe('Some tickets cannot be processed because: Another error message');
    expect(component.messagesResult.results[2].errorMsg).toBe('Non-lock match error');
  });

  it('should handle all lock match error codes', () => {
    // Arrange
    const result = new MessagesResult();
    result.results = [
      { errorCode: 1000000, errorMsg: 'Error 1' },
      { errorCode: 101, errorMsg: 'Error 2' },
      { errorCode: 100, errorMsg: 'Error 3' },
      { errorCode: 103, errorMsg: 'Error 4' },
      { errorCode: 102, errorMsg: 'Error 5' }
    ] as unknown as Result<string>[];
    component.messagesResult = result;

    // Act
    component.ngOnChanges({
      messagesResult: {
        currentValue: result,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    // Check that all lock match error codes have the prefix added
    expect(result.results[0].errorMsg).toBe('Some tickets cannot be processed because: Error 1');
    expect(result.results[1].errorMsg).toBe('Some tickets cannot be processed because: Error 2');
    expect(result.results[2].errorMsg).toBe('Some tickets cannot be processed because: Error 3');
    expect(result.results[3].errorMsg).toBe('Some tickets cannot be processed because: Error 4');
    expect(result.results[4].errorMsg).toBe('Some tickets cannot be processed because: Error 5');
  });
}); 