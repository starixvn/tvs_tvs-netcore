import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { DateFullTimeNewComponent } from '../../../../../utility/modules/date-time/date-full-time-new/date-full-time-new.component';
import { ToolTipModule } from '../../../../../utility/modules/tooltip/tooltip.module';
import { AddRequestStore } from '../../add-request.store';
import { AllowanceTimeComponent } from '../allowance-time/allowance-time.component';
import { FilterWrongScoreModel } from '../models/filter-wrong-score.model';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { FilterWrongScoreComponent } from './filter-wrong-score.component';

class Helper {
  static readonly fakeFilterWrongScoreModel: FilterWrongScoreModel = {
    fromDateTime: '2020-10-08 09:44:46.361 PM',
    toDateTime: '2020-10-09 09:44:46.361 PM',
    allowanceTime: new AllowanceTime()
  };
}

@NgModule({
  declarations: [
    AllowanceTimeComponent,
    DateFullTimeNewComponent
  ],
  imports: [
    NgbModule,
    FormsModule,
    ToolTipModule
  ],
  providers: [
    ValidationService,
    WrongScoreService,
    AddRequestStore
  ]
})
class AppModuleTest { }

describe('FilterWrongScoreComponent', () => {
  let shallow: Shallow<FilterWrongScoreComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterWrongScoreComponent, AppModuleTest)
    .dontMock(NgbModule)
    .mock(ElementRef, {});
  });

  it('changeFilter should emit #changeFilterEvent', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeSavingRequestStatus = jest.fn();
    const instance = new FilterWrongScoreComponent(null, null, null, addRequestStore);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.changeFilterEvent.emit = jest.fn();

    instance.changeFilter();

    expect(instance.changeFilterEvent.emit).toBeCalledTimes(1);
    expect(addRequestStore.changeSavingRequestStatus).toBeCalledTimes(1);
  });

  it('getDurationTime should be return "-" when fromTime null', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeSavingRequestStatus = jest.fn();
    const instance = new FilterWrongScoreComponent(null, null, null, addRequestStore);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = null;

    const result = instance.getDurationTime();

    expect(result).toBe('-');
  });

  it('getDurationTime should be return "-" when fromTime invalid', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeSavingRequestStatus = jest.fn();
    const instance = new FilterWrongScoreComponent(null, null, null, addRequestStore);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);

    const result = instance.getDurationTime();

    expect(instance.fromTimeComponent.isTimeValid).toBeCalledTimes(1);
    expect(result).toBe('-');
  });

  it('getDurationTime should be return "-" when toTime invalid', async () => {
    const wrongScoreService = new WrongScoreService(null, null);
    wrongScoreService.getDurationTime = jest.fn().mockImplementation(() => '4m11s');
    const instance = new FilterWrongScoreComponent(null, null, wrongScoreService, null);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);

    const result = instance.getDurationTime();

    expect(instance.fromTimeComponent.isTimeValid).toBeCalledTimes(1);
    expect(result).toBe('-');
  });

  it('getDurationTime should be return "-" when toTime null', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeSavingRequestStatus = jest.fn();
    const instance = new FilterWrongScoreComponent(null, null, null, addRequestStore);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent = null;

    const result = instance.getDurationTime();

    expect(instance.fromTimeComponent.isTimeValid).toBeCalledTimes(1);
    expect(result).toBe('-');
  });

  it('getDurationTime should be return correct time when toTime invalid', async () => {
    const wrongScoreService = new WrongScoreService(null, null);
    wrongScoreService.getDurationTime = jest.fn().mockImplementation(() => '4m11s');
    const instance = new FilterWrongScoreComponent(null, null, wrongScoreService, null);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);

    const result = instance.getDurationTime();

    expect(instance.fromTimeComponent.isTimeValid).toBeCalledTimes(1);
    expect(instance.toTimeComponent.isTimeValid).toBeCalledTimes(1);
    expect(result).toBe('4m11s');
  });

  it('isValid should be return false time when fromTime invalid', async () => {
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => false);
    const instance = new FilterWrongScoreComponent(null, validationService, null, null);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => false);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);

    const result = instance.isValid();

    expect(instance.fromTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(result).toBe(false);
  });

  it('isValid should be return false time when toTime invalid', async () => {
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => false);
    const instance = new FilterWrongScoreComponent(null, validationService, null, null);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => false);

    const result = instance.isValid();

    expect(instance.fromTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(instance.toTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(result).toBe(false);
  });

  it('isValid should be return false time when isFromTimeSameOrBeforeToTime is false', async () => {
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => false);
    const instance = new FilterWrongScoreComponent(null, validationService, null, null);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);

    const result = instance.isValid();
    expect(instance.fromTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(instance.toTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(validationService.isFromTimeSameOrBeforeToTime).toBeCalledTimes(1);
    expect(result).toBe(false);
  });

  it('isValid should be return false time when isValidAllowanceTime is false', async () => {
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => true);
    const instance = new FilterWrongScoreComponent(null, validationService, null, null);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    instance.allowanceTimeComponent = new AllowanceTimeComponent(null);
    instance.allowanceTimeComponent.isValidAllowanceTime = jest.fn().mockImplementation(() => false);

    const result = instance.isValid();
    expect(instance.fromTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(instance.toTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(validationService.isFromTimeSameOrBeforeToTime).toBeCalledTimes(1);
    expect(instance.allowanceTimeComponent.isValidAllowanceTime).toBeCalledTimes(1);
    expect(result).toBe(false);
  });

  it('isValid should be return true', async () => {
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => true);
    const instance = new FilterWrongScoreComponent(null, validationService, null, null);
    instance.filterWrongScoreModel = Helper.fakeFilterWrongScoreModel;
    instance.isVoided = false;
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    instance.allowanceTimeComponent = new AllowanceTimeComponent(null);
    instance.allowanceTimeComponent.isValidAllowanceTime = jest.fn().mockImplementation(() => true);

    const result = instance.isValid();
    expect(instance.fromTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(instance.toTimeComponent.validateWithTooltip).toBeCalledTimes(1);
    expect(validationService.isFromTimeSameOrBeforeToTime).toBeCalledTimes(1);
    expect(instance.allowanceTimeComponent.isValidAllowanceTime).toBeCalledTimes(1);
    expect(result).toBe(true);
  });
});