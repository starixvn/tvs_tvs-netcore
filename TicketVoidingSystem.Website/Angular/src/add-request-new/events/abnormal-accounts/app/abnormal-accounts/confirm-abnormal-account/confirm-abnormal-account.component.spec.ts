import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmAbnormalAccountComponent } from './confirm-abnormal-account.component';

describe('ConfirmAbnormalAccountComponent', () => {
  let component: ConfirmAbnormalAccountComponent;
  let fixture: ComponentFixture<ConfirmAbnormalAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAbnormalAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAbnormalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
