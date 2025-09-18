import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoSiteDBDownComponent } from './info-site-db-down.component';
import { InfoSiteDBDownModel } from './info-site-db-down.model';

describe('InfoSiteDBDownComponent', () => {
  let component: InfoSiteDBDownComponent;
  let fixture: ComponentFixture<InfoSiteDBDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({})
      .compileComponents();

    fixture = TestBed.createComponent(InfoSiteDBDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set isSiteDBDown to false when infoSiteDBDownModel is null', () => {
      // Arrange
      const mockModel = null;

      // Act
      component.infoSiteDBDownModel = mockModel;
      component.ngOnChanges({
        infoSiteDBDownModel: {
          currentValue: mockModel,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Assert
      expect(component.isSiteDBDown).toBe(false);
    });

    it('should set isSiteDBDown to false when infoSiteDBDownModel is undefined', () => {
      // Arrange
      const mockModel = undefined;

      // Act
      component.infoSiteDBDownModel = mockModel;
      component.ngOnChanges({
        infoSiteDBDownModel: {
          currentValue: mockModel,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Assert
      expect(component.isSiteDBDown).toBe(false);
    });

    it('should set isSiteDBDown to true and update properties when infoSiteDBDownModel is valid', () => {
      // Arrange
      const mockModel: InfoSiteDBDownModel = {
        singleCount: 5,
        parlayCount: 3,
        cancelCashOutCount: 2,
        usernames: 'user1,user2',
        siteDBDownInfoJson: 'test'
      };

      // Act
      component.infoSiteDBDownModel = mockModel;
      component.ngOnChanges({
        infoSiteDBDownModel: {
          currentValue: mockModel,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Assert
      expect(component.isSiteDBDown).toBe(true);
      expect(component.infoSiteDBDownModel.singleCount).toBe(5);
      expect(component.infoSiteDBDownModel.parlayCount).toBe(3);
      expect(component.infoSiteDBDownModel.cancelCashOutCount).toBe(2);
      expect(component.infoSiteDBDownModel.usernames).toBe('user1,user2');
    });

    it('should not update properties when infoSiteDBDownModel property is not changed', () => {
      // Arrange
      const mockModel: InfoSiteDBDownModel = {
        singleCount: 5,
        parlayCount: 3,
        cancelCashOutCount: 2,
        usernames: 'user1,user2',
        siteDBDownInfoJson: 'test'
      };

      component.infoSiteDBDownModel = mockModel;
      component.infoSiteDBDownModel.singleCount = 10; // Set initial value

      // Act
      component.ngOnChanges({
        otherProperty: {
          currentValue: 'test',
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Assert
      expect(component.infoSiteDBDownModel.singleCount).toBe(10); // Should remain unchanged
    });
  });

  describe('affectedSiteInfo', () => {
    it('should return affected user info when usernames are provided', () => {
      // Arrange
      component.infoSiteDBDownModel = {} as InfoSiteDBDownModel;
      component.infoSiteDBDownModel.usernames = 'user1,user2,user3';

      // Act
      const result = component.affectedSiteInfo();

      // Assert
      expect(result).toBe('Username(s): <strong>user1, user2, user3</strong>');
    });

    it('should return affected ticket info when not have usernames', () => {
      // Arrange
      component.infoSiteDBDownModel = {} as InfoSiteDBDownModel;
      component.infoSiteDBDownModel.usernames = '';
      component.infoSiteDBDownModel.singleCount = 5;
      component.infoSiteDBDownModel.parlayCount = 3;
      component.infoSiteDBDownModel.cancelCashOutCount = 2;
      const TestCaseUserNames = ['', null, undefined];

      // Act & Assert
      TestCaseUserNames.forEach(userNames => {
        component.infoSiteDBDownModel.usernames = userNames;
        const result = component.affectedSiteInfo();
        expect(result).toBe('Affected Single Count: <strong>5</strong>, Parlay Count: <strong>3</strong>, Cancel Cash Out Count: <strong>2</strong>');
      });
    });

    describe('affectedTicketInfo (private method testing through public interface)', () => {
      it('should return correct format when has ticket site db down', () => {
        // Arrange
        const TestCases = [{ singleCount: 5, parlayCount: 3, ccoCount: 2, expectedResult: 'Affected Single Count: <strong>5</strong>, Parlay Count: <strong>3</strong>, Cancel Cash Out Count: <strong>2</strong>' },
        { singleCount: 0, parlayCount: 3, ccoCount: 2, expectedResult: 'Affected Parlay Count: <strong>3</strong>, Cancel Cash Out Count: <strong>2</strong>' },
        { singleCount: 5, parlayCount: 0, ccoCount: 2, expectedResult: 'Affected Single Count: <strong>5</strong>, Cancel Cash Out Count: <strong>2</strong>' },
        { singleCount: 5, parlayCount: 3, ccoCount: 0, expectedResult: 'Affected Single Count: <strong>5</strong>, Parlay Count: <strong>3</strong>' },
        { singleCount: 0, parlayCount: 0, ccoCount: 2, expectedResult: 'Affected Cancel Cash Out Count: <strong>2</strong>' },
        { singleCount: 5, parlayCount: 0, ccoCount: 0, expectedResult: 'Affected Single Count: <strong>5</strong>' },
        { singleCount: 0, parlayCount: 3, ccoCount: 0, expectedResult: 'Affected Parlay Count: <strong>3</strong>' },
        ];

        component.infoSiteDBDownModel = {} as InfoSiteDBDownModel;
        // Act & Assert
        TestCases.forEach(testCase => {
          component.infoSiteDBDownModel.singleCount = testCase.singleCount;
          component.infoSiteDBDownModel.parlayCount = testCase.parlayCount;
          component.infoSiteDBDownModel.cancelCashOutCount = testCase.ccoCount;
          const result = component.affectedSiteInfo();
          expect(result).toBe(testCase.expectedResult);
        });
      });
    });
  });

  describe('affectedTicketOfSiteDBDown (private method testing through ngOnChanges)', () => {
    it('should return false when model is null or undefined', () => {
      // Arrange
      const MockModel = [null, undefined];

      // Act & Assert
      MockModel.forEach(mockModel => {
        component.infoSiteDBDownModel = mockModel;
        component.ngOnChanges({
          infoSiteDBDownModel: {
            currentValue: mockModel,
            previousValue: undefined,
            firstChange: true,
            isFirstChange: () => true
          }
        });
        expect(component.isSiteDBDown).toBe(false);
      });
    });

    it('should return true and update all properties when model is valid', () => {
      // Arrange
      const mockModel: InfoSiteDBDownModel = {
        singleCount: 10,
        parlayCount: 5,
        cancelCashOutCount: 3,
        usernames: 'testuser1,testuser2',
        siteDBDownInfoJson: 'test json'
      };

      // Act
      component.infoSiteDBDownModel = mockModel;
      component.ngOnChanges({
        infoSiteDBDownModel: {
          currentValue: mockModel,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Assert
      expect(component.isSiteDBDown).toBe(true);
      expect(component.infoSiteDBDownModel.singleCount).toBe(10);
      expect(component.infoSiteDBDownModel.parlayCount).toBe(5);
      expect(component.infoSiteDBDownModel.cancelCashOutCount).toBe(3);
      expect(component.infoSiteDBDownModel.usernames).toBe('testuser1,testuser2');
    });
  });

  describe('Component initialization', () => {
    it('should initialize with default values', () => {
      // Assert
      expect(component.isSiteDBDown).toBe(false);
      expect(component.infoSiteDBDownModel).toBeUndefined();
    });

    it('should have infoSiteDBDownModel as undefined initially', () => {
      // Assert
      expect(component.infoSiteDBDownModel).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle very large numbers', () => {
      // Arrange
      const mockModel: InfoSiteDBDownModel = {
        singleCount: 999999,
        parlayCount: 888888,
        cancelCashOutCount: 777777,
        usernames: 'user1,user2',
        siteDBDownInfoJson: 'test'
      };

      // Act
      component.infoSiteDBDownModel = mockModel;
      component.ngOnChanges({
        infoSiteDBDownModel: {
          currentValue: mockModel,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Assert
      expect(component.isSiteDBDown).toBe(true);
      expect(component.infoSiteDBDownModel.singleCount).toBe(999999);
      expect(component.infoSiteDBDownModel.parlayCount).toBe(888888);
      expect(component.infoSiteDBDownModel.cancelCashOutCount).toBe(777777);
    });

    it('should handle very long usernames string', () => {
      // Arrange
      const longUsernames = 'user1,user2,user3,user4,user5,user6,user7,user8,user9,user10';
      const showUsernames = 'user1, user2, user3, user4, user5, user6, user7, user8, user9, user10';
      const mockModel: InfoSiteDBDownModel = {
        singleCount: 1,
        parlayCount: 1,
        cancelCashOutCount: 1,
        usernames: longUsernames,
        siteDBDownInfoJson: 'test'
      };

      // Act
      component.infoSiteDBDownModel = mockModel;
      component.ngOnChanges({
        infoSiteDBDownModel: {
          currentValue: mockModel,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Assert
      expect(component.isSiteDBDown).toBe(true);
      expect(component.infoSiteDBDownModel.usernames).toBe(longUsernames);
      expect(component.affectedSiteInfo()).toBe(`Username(s): <strong>${showUsernames}</strong>`);
    });

    it('should handle negative numbers gracefully', () => {
      // Arrange
      const mockModel: InfoSiteDBDownModel = {
        singleCount: -5,
        parlayCount: -3,
        cancelCashOutCount: -2,
        usernames: 'user1',
        siteDBDownInfoJson: 'test'
      };

      // Act
      component.infoSiteDBDownModel = mockModel;
      component.ngOnChanges({
        infoSiteDBDownModel: {
          currentValue: mockModel,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Assert
      expect(component.isSiteDBDown).toBe(true);
      expect(component.infoSiteDBDownModel.singleCount).toBe(-5);
      expect(component.infoSiteDBDownModel.parlayCount).toBe(-3);
      expect(component.infoSiteDBDownModel.cancelCashOutCount).toBe(-2);
    });
  });
});
