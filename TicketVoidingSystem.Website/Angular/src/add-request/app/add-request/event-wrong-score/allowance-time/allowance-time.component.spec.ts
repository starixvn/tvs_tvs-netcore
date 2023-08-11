
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { TooltipComponent } from '../../../../../utility/components/tooltip/tooltip.component';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { AllowanceTimeComponent } from './allowance-time.component';

@NgModule({
  declarations: [
    AllowanceTimeComponent,
    TooltipComponent
  ],
  imports: [FormsModule]
})
class AppModuleTest { }

describe('AllowanceTimeComponent', () => {
  let shallow: Shallow<AllowanceTimeComponent>;

  beforeEach(() => {
    shallow = new Shallow(AllowanceTimeComponent, AppModuleTest);
  });

  it('AllowanceTimeComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#emitModelChange should be called', async () => {
    // Arrange
    const { instance, outputs } = await shallow.render();
    const spyChangeModelOutput = jest.spyOn(outputs.changeModel, 'emit').mockImplementation(jest.fn());

    instance.emitModelChange();
    // Assert
    expect(spyChangeModelOutput).toBeCalledTimes(1);
    expect(spyChangeModelOutput).toBeCalledWith();
  });

  it('#isValidAllowanceTime should return false', async () => {
    // Arrange
    const mockAllowanceTime: AllowanceTime = {
      aaTime: 1,
      paTime: null,
      saTime: null
    };
    const { instance } = await shallow.render({
      bind: { allowanceTime: mockAllowanceTime }
    });
    instance.tooltip.display = jest.fn();

    const result = instance.isValidAllowanceTime();

    // Assert
    expect(result).toBe(false);
    expect(instance.tooltip.display).toBeCalledTimes(1);
  });

  it('#isValidAllowanceTime should return true', async () => {
    // Arrange
    const mockAllowanceTime: AllowanceTime = {
      aaTime: null,
      paTime: null,
      saTime: null
    };
    const { instance } = await shallow.render({
      bind: { allowanceTime: mockAllowanceTime }
    });
    instance.tooltip.display = jest.fn();

    const result = instance.isValidAllowanceTime();

    // Assert
    expect(result).toBe(true);
    expect(instance.tooltip.display).toBeCalledTimes(0);
  });

  it('#isValidAllowanceTime should return true', async () => {
    // Arrange
    const mockAllowanceTime: AllowanceTime = {
      aaTime: 0,
      paTime: 0,
      saTime: 0
    };
    const { instance } = await shallow.render({
      bind: { allowanceTime: mockAllowanceTime }
    });
    instance.tooltip.display = jest.fn();

    const result = instance.isValidAllowanceTime();

    // Assert
    expect(result).toBe(true);
    expect(instance.tooltip.display).toBeCalledTimes(0);
  });
});