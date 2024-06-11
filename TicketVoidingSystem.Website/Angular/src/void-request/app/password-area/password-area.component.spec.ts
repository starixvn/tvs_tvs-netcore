import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordAreaComponent } from './password-area.component';

describe('ConfirmationComponent', () => {
  let component: PasswordAreaComponent;
  let fixture: ComponentFixture<PasswordAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
