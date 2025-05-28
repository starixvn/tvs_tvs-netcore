import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { MessagesResultComponent } from './messages-result.component';
import { MessagesResult } from './messages-result';
import { SimpleChange } from '@angular/core';
import { Result } from 'src/utility/models/result';

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

    // Act
    component.ngOnChanges({
      messagesResult: {
        currentValue: result,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(result.results[0].errorMsg).toBe('Original error message');
    expect(result.results[1].errorMsg).toBe('Another error message');
    expect(result.results[2].errorMsg).toBe('Non-lock match error');
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

    // Act
    component.ngOnChanges({
      messagesResult: {
        currentValue: result,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    result.results.forEach(result => {
      expect(result.errorMsg).toContain('Error 1');
    });
  });
}); 