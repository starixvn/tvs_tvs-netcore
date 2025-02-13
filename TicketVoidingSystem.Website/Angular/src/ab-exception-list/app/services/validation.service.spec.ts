import { TestBed } from '@angular/core/testing';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { UsernamesComponent } from '../../../utility/components/user-names/user-names.component';
import { GroupUsername } from '../../../utility/components/user-names/user-names.model';
import { AppService } from '../app.service';
import { FilterComponent } from '../filter/filter.component';
import { FilterModel } from '../filter/filter.model';
import { CheckUsernameModel } from '../models/check-username.model';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let validationService: ValidationService;
  let appServiceMock: jest.Mocked<AppService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationService,
        { provide: AppService, useValue: { checkUsernames: jest.fn() } },
      ],
    });

    validationService = TestBed.inject(ValidationService);
    appServiceMock = TestBed.inject(AppService) as jest.Mocked<AppService>;
  });


  it('#validateUsernames should call #checkValidItems when username is empty', async () => {
    const usernamesComponent = new UsernamesComponent(null);
    usernamesComponent.checkValidItems = jest.fn().mockReturnValue(true);
    const result = await validationService.validateUsernames('', usernamesComponent);

    expect(usernamesComponent.checkValidItems).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  });

  it('#validateUsernames should call #checkValidItems when have error invalidUsernames', async () => {
    const usernamesComponent = new UsernamesComponent(null);
    usernamesComponent.groupUsername = new GroupUsername();
    usernamesComponent.groupUsername.resetAllValue = jest.fn();
    usernamesComponent.groupUsername.updateInvalid = jest.fn();
    usernamesComponent.checkValidItems = jest.fn().mockReturnValue(true);
    const checkUsernameModel: CheckUsernameModel = {
      invalidUsernames: 'name',
      existedUsernames: '112'
    };
    appServiceMock.checkUsernames = jest.fn().mockResolvedValue(checkUsernameModel);

    const result = await validationService.validateUsernames('name', usernamesComponent);

    expect(usernamesComponent.groupUsername.resetAllValue).toHaveBeenCalledTimes(1);
    expect(usernamesComponent.groupUsername.updateInvalid).toHaveBeenCalledTimes(1);
    expect(usernamesComponent.checkValidItems).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  });

  it('#validateUsernames should call #checkValidItems when have not error', async () => {
    const usernamesComponent = new UsernamesComponent(null);
    usernamesComponent.groupUsername = new GroupUsername();
    usernamesComponent.groupUsername.resetAllValue = jest.fn();
    usernamesComponent.checkValidItems = jest.fn().mockReturnValue(true);
    const checkUsernameModel: CheckUsernameModel = {
      invalidUsernames: '',
      existedUsernames: ''
    };
    appServiceMock.checkUsernames = jest.fn().mockResolvedValue(checkUsernameModel);

    const result = await validationService.validateUsernames('name', usernamesComponent);

    expect(usernamesComponent.groupUsername.resetAllValue).toHaveBeenCalledTimes(1);
    expect(usernamesComponent.checkValidItems).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  });

  it('#validateCommonData should return false when have not site', async () => {
    const filterComponent = TestBed.createComponent(FilterComponent).componentInstance;
    filterComponent.tooltip = new Tooltip();
    filterComponent.tooltip.display = jest.fn();
    const filterModel = new FilterModel();

    ['', null].forEach(x => {
      filterModel.sites = x;
      const result = validationService.validateCommonData(filterModel, filterComponent);

      expect(result).toBeFalsy();
    });
  });

  it('#validateCommonData should return false when have not subTypes', async () => {
    const filterComponent = TestBed.createComponent(FilterComponent).componentInstance;
    filterComponent.tooltip = new Tooltip();
    filterComponent.tooltip.display = jest.fn();
    const filterModel = new FilterModel();
    filterModel.sites = '1,2';

    ['', null].forEach(x => {
      filterModel.subTypes = x;
      const result = validationService.validateCommonData(filterModel, filterComponent);

      expect(result).toBeFalsy();
    });
  });

  it('#validateCommonData should return false when have not voidVIP', async () => {
    const filterComponent = TestBed.createComponent(FilterComponent).componentInstance;
    filterComponent.tooltip = new Tooltip();
    filterComponent.tooltip.display = jest.fn();
    const filterModel = new FilterModel();
    filterModel.sites = '1,2';
    filterModel.subTypes = '1,2';

    ['', null].forEach(x => {
      filterModel.voidVIP = x;
      const result = validationService.validateCommonData(filterModel, filterComponent);

      expect(result).toBeFalsy();
    });
  });

  it('#validateCommonData should return true', async () => {
    const filterComponent = TestBed.createComponent(FilterComponent).componentInstance;
    filterComponent.tooltip = new Tooltip();
    filterComponent.tooltip.display = jest.fn();
    const filterModel = new FilterModel();
    filterModel.sites = '1,2';
    filterModel.subTypes = '1,2';
    filterModel.voidVIP = '1,2';

    const result = validationService.validateCommonData(filterModel, filterComponent);

    expect(result).toBeTruthy();
  });
});
