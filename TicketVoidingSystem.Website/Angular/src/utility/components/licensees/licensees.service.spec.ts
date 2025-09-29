import { TestBed } from '@angular/core/testing';
import { LicenseesService } from './licensees.service';
import { GroupLicenseeModel, GroupLicensee, Licensee } from './licensees.model';

describe('LicenseesService', () => {
  let service: LicenseesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('changeCheckAllLicensee', () => {
    it('should check all groups when parent is checked', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);
      const licensee3 = new Licensee(3, 'Licensee 3', false);
      const licensee4 = new Licensee(4, 'Licensee 4', false);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], false);
      const group2 = new GroupLicensee('Group 2', [licensee3, licensee4], false);
      const groupLicenseeModel = new GroupLicenseeModel([group1, group2], true);

      // Act
      service.changeCheckAllLicensee(groupLicenseeModel);

      // Assert
      expect(groupLicenseeModel.groupLicensees[0].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[1].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[0].licensees[0].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[0].licensees[1].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[1].licensees[0].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[1].licensees[1].isChecked).toBe(true);
    });

    it('should uncheck all groups when parent is unchecked', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', true);
      const licensee2 = new Licensee(2, 'Licensee 2', true);
      const licensee3 = new Licensee(3, 'Licensee 3', true);
      const licensee4 = new Licensee(4, 'Licensee 4', true);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], true);
      const group2 = new GroupLicensee('Group 2', [licensee3, licensee4], true);
      const groupLicenseeModel = new GroupLicenseeModel([group1, group2], false);

      // Act
      service.changeCheckAllLicensee(groupLicenseeModel);

      // Assert
      expect(groupLicenseeModel.groupLicensees[0].isChecked).toBe(false);
      expect(groupLicenseeModel.groupLicensees[1].isChecked).toBe(false);
      expect(groupLicenseeModel.groupLicensees[0].licensees[0].isChecked).toBe(false);
      expect(groupLicenseeModel.groupLicensees[0].licensees[1].isChecked).toBe(false);
      expect(groupLicenseeModel.groupLicensees[1].licensees[0].isChecked).toBe(false);
      expect(groupLicenseeModel.groupLicensees[1].licensees[1].isChecked).toBe(false);
    });
  });

  describe('changeCheckGroupToModel', () => {
    it('should set model as checked when all groups are checked', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', true);
      const licensee2 = new Licensee(2, 'Licensee 2', true);
      const licensee3 = new Licensee(3, 'Licensee 3', true);
      const licensee4 = new Licensee(4, 'Licensee 4', true);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], true);
      const group2 = new GroupLicensee('Group 2', [licensee3, licensee4], true);
      const groupLicenseeModel = new GroupLicenseeModel([group1, group2], true);

      // Act
      service.changeCheckGroupToModel(groupLicenseeModel);

      // Assert
      expect(groupLicenseeModel.isChecked).toBe(true);
    });

    it('should set model as unchecked when not all groups are checked', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);
      const licensee3 = new Licensee(3, 'Licensee 3', true);
      const licensee4 = new Licensee(4, 'Licensee 4', true);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], false);
      const group2 = new GroupLicensee('Group 2', [licensee3, licensee4], true);
      const groupLicenseeModel = new GroupLicenseeModel([group1, group2], false);

      // Act
      service.changeCheckGroupToModel(groupLicenseeModel);

      // Assert
      expect(groupLicenseeModel.isChecked).toBe(false);
    });
  });

  describe('getCheckedLicensees', () => {
    it('should return only checked licensees', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);
      const licensee3 = new Licensee(3, 'Licensee 3', false);
      const licensee4 = new Licensee(4, 'Licensee 4', false);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], true);
      const group2 = new GroupLicensee('Group 2', [licensee3, licensee4], false);
      const groupLicensees = [group1, group2];

      // Act
      const result = service.getCheckedLicensees(groupLicensees);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toContain(group1.licensees[0]);
      expect(result).toContain(group1.licensees[1]);
      expect(result).not.toContain(group2.licensees[0]);
      expect(result).not.toContain(group2.licensees[1]);
    });

    it('should return empty array when no licensees are checked', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);
      const licensee3 = new Licensee(3, 'Licensee 3', false);
      const licensee4 = new Licensee(4, 'Licensee 4', false);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], false);
      const group2 = new GroupLicensee('Group 2', [licensee3, licensee4], false);
      const groupLicensees = [group1, group2];

      // Act
      const result = service.getCheckedLicensees(groupLicensees);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('checkLicenseesByName', () => {
    it('should check licensees that match selected names', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);
      const licensee3 = new Licensee(3, 'Licensee 3', false);
      const licensee4 = new Licensee(4, 'Licensee 4', false);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], false);
      const group2 = new GroupLicensee('Group 2', [licensee3, licensee4], false);
      const groupLicenseeModel = new GroupLicenseeModel([group1, group2], false);
      const selectedLicenseeNames = ['Licensee 1', 'Licensee 3'];

      // Act
      service.checkLicenseesByName(groupLicenseeModel, selectedLicenseeNames);

      // Assert
      expect(groupLicenseeModel.groupLicensees[0].licensees[0].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[0].licensees[1].isChecked).toBe(false);
      expect(groupLicenseeModel.groupLicensees[1].licensees[0].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[1].licensees[1].isChecked).toBe(false);
      expect(groupLicenseeModel.groupLicensees[0].isChecked).toBe(false); // Not all licensees in group1 are checked
      expect(groupLicenseeModel.groupLicensees[1].isChecked).toBe(false); // Not all licensees in group2 are checked
      expect(groupLicenseeModel.isChecked).toBe(false); // Not all groups are checked
    });

    it('should check all groups and model when all licensees are selected', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);
      const licensee3 = new Licensee(3, 'Licensee 3', false);
      const licensee4 = new Licensee(4, 'Licensee 4', false);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], false);
      const group2 = new GroupLicensee('Group 2', [licensee3, licensee4], false);
      const groupLicenseeModel = new GroupLicenseeModel([group1, group2], false);
      const selectedLicenseeNames = ['Licensee 1', 'Licensee 2', 'Licensee 3', 'Licensee 4'];

      // Act
      service.checkLicenseesByName(groupLicenseeModel, selectedLicenseeNames);

      // Assert
      expect(groupLicenseeModel.groupLicensees[0].licensees[0].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[0].licensees[1].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[1].licensees[0].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[1].licensees[1].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[0].isChecked).toBe(true);
      expect(groupLicenseeModel.groupLicensees[1].isChecked).toBe(true);
      expect(groupLicenseeModel.isChecked).toBe(true);
    });

    it('should handle null or undefined selectedLicenseeNames', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);

      const group1 = new GroupLicensee('Group 1', [licensee1, licensee2], false);
      const groupLicenseeModel = new GroupLicenseeModel([group1], false);

      // Act
      service.checkLicenseesByName(groupLicenseeModel, null);

      // Assert
      expect(group1.licensees[0].isChecked).toBe(false);
      expect(group1.licensees[1].isChecked).toBe(false);
      expect(group1.isChecked).toBe(false);
      expect(groupLicenseeModel.isChecked).toBe(false);
    });
  });

  describe('checkedGroup', () => {
    it('should check all licensees in group when group is checked', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);
      const group = new GroupLicensee('Group 1', [licensee1, licensee2], true);

      // Act
      service.checkedGroup(group);

      // Assert
      expect(group.licensees[0].isChecked).toBe(true);
      expect(group.licensees[1].isChecked).toBe(true);
    });

    it('should uncheck all licensees in group when group is unchecked', () => {
      // Arrange
      const licensee1 = new Licensee(1, 'Licensee 1', false);
      const licensee2 = new Licensee(2, 'Licensee 2', false);
      const group = new GroupLicensee('Group 1', [licensee1, licensee2], false);

      // Act
      service.checkedGroup(group);

      // Assert
      expect(group.licensees[0].isChecked).toBe(false);
      expect(group.licensees[1].isChecked).toBe(false);
    });
  });
});
