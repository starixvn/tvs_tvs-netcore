import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoidReasonComponent } from './void-reason.component';

describe('ReasonComponent', () => {
  let component: VoidReasonComponent;
  let fixture: ComponentFixture<VoidReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
