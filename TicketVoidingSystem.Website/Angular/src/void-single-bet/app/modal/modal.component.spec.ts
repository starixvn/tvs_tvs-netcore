import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { Modal } from './modal';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('confirm', () => {
    // Arrange
    component.modal = new Modal();
    spyOn(component.confirmEvent, 'emit');
    // Action and Asert
    component.confirm();
    expect(component.modal.isShow).toBe(false);
    expect(component.confirmEvent.emit).toHaveBeenCalledWith(true);
  });

  it('close', () => {
    // Arrange
    component.modal = new Modal();
    spyOn(component.closeEvent, 'emit');
    // Action and Asert
    component.close();
    expect(component.modal.isShow).toBe(false);
    expect(component.closeEvent.emit).toHaveBeenCalledWith(true);
  });
});
