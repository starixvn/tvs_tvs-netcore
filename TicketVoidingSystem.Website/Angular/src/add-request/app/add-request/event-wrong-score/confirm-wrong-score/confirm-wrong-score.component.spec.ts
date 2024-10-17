
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { ConfirmWrongScoreComponent } from './confirm-wrong-score.component';

@NgModule({
  declarations: [],
  imports: [FormsModule]
})
class AppModuleTest { }

describe('ConfirmWrongScoreComponent', () => {
  let shallow: Shallow<ConfirmWrongScoreComponent>;

  beforeEach(() => {
    shallow = new Shallow(ConfirmWrongScoreComponent, AppModuleTest);
  });

  it('ConfirmWrongScoreComponent should match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render({
      bind: { model: { isOpenDialog: true } }
    });

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#closeClick', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: { model: { isOpenDialog: true } }
    });
    const spyCloseOutput = jest.spyOn(instance.close, 'emit').mockImplementation(jest.fn());

    instance.closeClick();

    // Assert
    expect(instance.model.isOpenDialog).toBe(false);
    expect(spyCloseOutput).toBeCalledTimes(1);
  });

  it('#saveClick', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const spySaveOutput = jest.spyOn(instance.save, 'emit').mockImplementation(jest.fn());

    instance.saveClick();

    // Assert
    expect(instance.model.isOpenDialog).toBe(false);
    expect(spySaveOutput).toBeCalledTimes(1);
  });
});
