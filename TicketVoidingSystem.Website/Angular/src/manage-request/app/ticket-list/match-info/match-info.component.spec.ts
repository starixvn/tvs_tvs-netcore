import { MatchInfoComponent } from './match-info.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('MatchInfoComponent', () => {
  let component: MatchInfoComponent;
  let fixture: ComponentFixture<MatchInfoComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(MatchInfoComponent);
    component = fixture.componentInstance;
  });
  
  it('MatchInfoComponent should init match snapshot', async() => {
    // Arrange
    // Assert
    expect(component).toBeTruthy();
  });
});
