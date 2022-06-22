import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlockFullUiComponent } from './block-full-ui.component';

describe('BlockFullUiComponent', () => {
  let component: BlockFullUiComponent;
  let fixture: ComponentFixture<BlockFullUiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockFullUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockFullUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
