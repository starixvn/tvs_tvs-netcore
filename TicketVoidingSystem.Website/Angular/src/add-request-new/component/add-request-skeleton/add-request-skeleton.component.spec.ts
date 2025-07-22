import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestSkeletonComponent } from './add-request-skeleton.component';

describe('AddRequestSkeletonComponent', () => {
  let component: AddRequestSkeletonComponent;
  let fixture: ComponentFixture<AddRequestSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRequestSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRequestSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
