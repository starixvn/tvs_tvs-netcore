import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BetTypesVirtualSportComponent } from './bettypes-virtualsports.component';
import { SimpleChange } from '@angular/core';
import { ToolTipModule } from '../../modules/tooltip/tooltip.module';
import { GroupBetTypeVirtualSport, BetTypeVirtualSport } from './bettypes-virtualsports.model';
import { Tooltip } from '../../modules/tooltip/tooltip.model';
import { TEXT } from '../../constants/text';

describe('BetTypesVirtualSportComponent', () => {
  let component: BetTypesVirtualSportComponent;
  let fixture: ComponentFixture<BetTypesVirtualSportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BetTypesVirtualSportComponent ],
      imports: [
        ToolTipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetTypesVirtualSportComponent);
    component = fixture.componentInstance;
  });

  it('ngOnChanges', () => {
    // Arrange
    const changes = {
        'sportType': new SimpleChange('0', '1', true) 
      };
    spyOn(component, 'changeDisplay');
    // Action and Assert
    component.ngOnChanges(changes);
    expect(component.changeDisplay).toHaveBeenCalled();
  });

  it('Change display', () => {
    // Arrange
    const data = [
        new GroupBetTypeVirtualSport([0,1],[new BetTypeVirtualSport(1, 'Handicap')])
      ];
    component.groups = data;
    component.sportType = 1;
    // Action and Assert
    component.changeDisplay();
    expect(component.display).toBe(true);
    expect(component.groups[0].betTypes[0].checked).toBe(component.display);
  });

  it('Validate', () => {
    // Arrange
    component.tooltip = new Tooltip();
    spyOn(component.tooltip, 'display');
    spyOn(component, 'getCheckedBetTypes').and.returnValue('');
    // Action and Assert
    const actualValue = component.validate();
    expect(actualValue).toBe(false);
    expect(component.tooltip.display).toHaveBeenCalledWith('checkbox-all-bettypes', TEXT.NO_CHECKED_BETTYPE);
  });

  it('Get checked bettypes', () => {
    // Arrange
    const groupBetTypeVirtualSport = new GroupBetTypeVirtualSport([0,1],[new BetTypeVirtualSport(1, 'Handicap')])
    groupBetTypeVirtualSport.changeDisplay(1);
    component.groups = [groupBetTypeVirtualSport];
    // Action and Assert
    const actualValue = component.getCheckedBetTypes();
    expect(actualValue).toBe('1');
  });
});
