import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { AutoRefreshComponent } from './auto-refresh.component';
import { AutoRefreshMode } from './auto-refresh.model';
import { SimpleChange } from '@angular/core';

describe('AutoRefreshComponent', () => {
  let component: AutoRefreshComponent;
  let fixture: ComponentFixture<AutoRefreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();

    fixture = TestBed.createComponent(AutoRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isBlock).toBeFalsy();
    expect(component.refreshTime).toBeTruthy();
    expect(component.intervalTimeText).toBeUndefined();
  });

  it('should start countdown when mode is START_OVER', () => {
    // Arrange
    component.refreshTime.value = '5';
    component.countdownEnd.emit = jest.fn();

    // Act
    component.ngOnChanges({
      mode: {
        currentValue: AutoRefreshMode.START_OVER,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });
    component.startOverCountdown();

    // Assert
    expect(component.intervalTimeText).toBe('5');
  });

  it('should stop countdown when mode is STOP', () => {
    // Arrange
    component.refreshTime.value = '5';
    component.countdownEnd.emit = jest.fn();
    component.startOverCountdown();

    // Act
    component.ngOnChanges({
      mode: {
        currentValue: AutoRefreshMode.STOP,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.intervalTimeText).toBe('5');
  });

  it('should refresh immediately and restart countdown', () => {
    // Arrange
    component.refreshTime.value = '5';
    component.countdownEnd.emit = jest.fn();
    component.startOverCountdown();

    // Act
    component.refreshImmediately();

    // Assert
    expect(component.countdownEnd.emit).toHaveBeenCalled();
    expect(component.intervalTimeText).toBe('5');
  });

  it('should not start countdown when refresh time is 0', () => {
    // Arrange
    component.refreshTime.value = '0';
    component.countdownEnd.emit = jest.fn();

    // Act
    component.startOverCountdown();

    // Assert
    expect(component.intervalTimeText).toBe('');
    expect(component.countdownEnd.emit).not.toHaveBeenCalled();
  });

  it('should clean up subscription on destroy', () => {
    // Arrange
    component.refreshTime.value = '5';
    component.startOverCountdown();
    const unsubscribeSpy = jest.spyOn(component['intervalTimeSubscription'], 'unsubscribe');

    // Act
    component.ngOnDestroy();

    // Assert
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should update interval time text during countdown', fakeAsync(() => {
    // Arrange
    component.refreshTime.value = '3';
    component.countdownEnd.emit = jest.fn();

    // Act
    component.startOverCountdown();
    tick(1000);

    // Assert
    expect(component.intervalTimeText).toBe('2');
    
    // Cleanup
    component.ngOnDestroy();
    discardPeriodicTasks();
  }));

  it('should emit countdownEnd when countdown reaches zero', fakeAsync(() => {
    // Arrange
    component.refreshTime.value = '2';
    component.countdownEnd.emit = jest.fn();

    // Act
    component.startOverCountdown();
    tick(2000);

    // Assert
    expect(component.countdownEnd.emit).toHaveBeenCalled();
    
    // Cleanup
    component.ngOnDestroy();
    discardPeriodicTasks();
  }));
});
