import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalContentComponent } from './modal-content.component';
import { IModal, ModalType } from '../modal.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

class Helper {
  static readonly fakeModalData = {
    title: 'Test Modal Title',
    message: 'Test modal message content',
    type: ModalType.Confirm,
    copyContent: false,
    content: []
  } as IModal;
}

describe('ModalContentComponent', () => {
  let component: ModalContentComponent;
  let fixture: ComponentFixture<ModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        providers: [NgbActiveModal]
    }).compileComponents();
    fixture = TestBed.createComponent(ModalContentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.data).toEqual({});
    expect(component.isProcessingOkCallback).toBeFalsy();
    expect(component.isProcessingYesCallback).toBeFalsy();
  });

  describe('confirmClickOk', () => {
    it('should emit confirm event and close modal', () => {
      // Arrange
      component.data = Helper.fakeModalData;
      const confirmSpy = jest.spyOn(component.confirm, 'emit');

      // Act
      component.confirmClickOk();

      // Assert
      expect(component.isProcessingOkCallback).toBeTruthy();
      expect(confirmSpy).toHaveBeenCalled();
    });
  });

  describe('confirmClickYes', () => {
    it('should emit confirmYes event and close modal', () => {
      // Arrange
      component.data = Helper.fakeModalData;
      const confirmYesSpy = jest.spyOn(component.confirmYes, 'emit');

      // Act
      component.confirmClickYes();

      // Assert
      expect(component.isProcessingYesCallback).toBeTruthy();
      expect(confirmYesSpy).toHaveBeenCalled();
    });
  });

  describe('confirmClickNo', () => {
    it('should emit confirmNo event and close modal', () => {
      // Arrange
      component.data = Helper.fakeModalData;
      const confirmNoSpy = jest.spyOn(component.confirmNo, 'emit');

      // Act
      component.confirmClickNo();

      // Assert
      expect(confirmNoSpy).toHaveBeenCalled();
    });
  });

  describe('dismissClick', () => {
    it('should emit close event and dismiss modal', () => {
      // Arrange
      component.data = Helper.fakeModalData;
      const closeSpy = jest.spyOn(component.close, 'emit');

      // Act
      component.dismissClick();

      // Assert
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('closeClick', () => {
    it('should emit close event and close modal', () => {
      // Arrange
      component.data = Helper.fakeModalData;
      const closeSpy = jest.spyOn(component.close, 'emit');

      // Act
      component.closeClick();

      // Assert
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('copiedContent', () => {
    it('should show alert when content is copied', () => {
      // Arrange
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Act
      component.copiedContent();

      // Assert
      expect(alertSpy).toHaveBeenCalledWith('The Content has been copied to clipboard.');
      
      // Cleanup
      alertSpy.mockRestore();
    });
  });
});
