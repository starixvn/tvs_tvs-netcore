import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbExceptionListComponent } from './ab-exception-list.component';

describe('AbExceptionListComponent', () => {
  let component: AbExceptionListComponent;
  let fixture: ComponentFixture<AbExceptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbExceptionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbExceptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
