import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBaseLayoutComponent } from '../../../../add-request-new/component/event-base-layout/event-base-layout.component';
import { OthersAbnormalBetComponent } from '../../../../add-request-new/component/others-abnormal-bet/others-abnormal-bet.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { RequestModel } from '../../../models/request.model';
import { AppComponent } from './app.component';
import { EventWrongScoreComponent } from './event-wrong-score/event-wrong-score.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        EventBaseLayoutComponent,
        OthersAbnormalBetComponent,
        EventWrongScoreComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct issue type', () => {
    expect(component.issueTypeId).toBe(IssueTypeConstant.WRONG_SCORE);
  });

  it('should have RequestModel instance', () => {
    expect(component.model).toBeInstanceOf(RequestModel);
  });

  it('should have saveRequest method', () => {
    expect(typeof component.saveRequest).toBe('function');
  });
});