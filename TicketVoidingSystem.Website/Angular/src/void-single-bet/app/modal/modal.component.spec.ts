import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';
import { Modal } from './modal.model';
import { TestingModule } from '../../../utility/modules/testing.module';

class Helper {
  static readonly modalHeaderSelector = '.modal-header span';
  static readonly modalBodySelector = '.modal-body div';
  static readonly modalConfirmSelector = '.modal-confirm';
  static readonly modalCancelSelector = '.modal-cancel';
  static readonly modalContentSelector = '.modal-content';

  static createFakeModal(): Modal {
    const modal = new Modal();
    modal.open('Test Header', 'Test Body');
    return modal;
  }
}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#confirm should emit confirmEvent and close modal', () => {
    // Arrange
    component.modal = Helper.createFakeModal();
    component.confirmEvent.emit = jest.fn();

    // Action
    component.confirm();

    // Assert
    expect(component.confirmEvent.emit).toHaveBeenCalledWith(true);
    expect(component.modal.isShow).toBeFalsy();
  });

  it('#close should emit closeEvent and close modal', () => {
    // Arrange
    component.modal = Helper.createFakeModal();
    component.closeEvent.emit = jest.fn();

    // Action
    component.close();

    // Assert
    expect(component.closeEvent.emit).toHaveBeenCalledWith(true);
    expect(component.modal.isShow).toBeFalsy();
  });

  it('should display modal header correctly', () => {
    // Arrange
    component.modal = Helper.createFakeModal();
    fixture.detectChanges();

    // Act
    const headerElement = fixture.nativeElement.querySelector(Helper.modalHeaderSelector);

    // Assert
    expect(headerElement.textContent).toContain(component.modal.header);
  });

  it('should display modal body correctly', () => {
    // Arrange
    component.modal = Helper.createFakeModal();
    fixture.detectChanges();

    // Act
    const bodyElement = fixture.nativeElement.querySelector(Helper.modalBodySelector);

    // Assert
    expect(bodyElement.textContent).toContain(component.modal.body);
  });

  it('should show modal when isShow is true', () => {
    // Arrange
    component.modal = Helper.createFakeModal();
    fixture.detectChanges();

    // Act
    const modalElement = fixture.nativeElement.querySelector('.modal');

    // Assert
    expect(modalElement).toBeTruthy();
  });

  it('should not show modal when isShow is false', () => {
    // Arrange
    const modal = Helper.createFakeModal();
    modal.close();
    component.modal = modal;
    fixture.detectChanges();

    // Act
    const modalElement = fixture.nativeElement.querySelector('.modal');

    // Assert
    expect(modalElement).toBeFalsy();
  });

  it('should call open method with correct parameters', () => {
    // Arrange
    const modal = new Modal();
    const header = 'Test Header';
    const body = 'Test Body';

    // Action
    modal.open(header, body);

    // Assert
    expect(modal.isShow).toBeTruthy();
    expect(modal.header).toBe(header);
    expect(modal.body).toBe(body);
  });

  it('should call close method and set isShow to false', () => {
    // Arrange
    const modal = Helper.createFakeModal();

    // Action
    modal.close();

    // Assert
    expect(modal.isShow).toBeFalsy();
  });
});
