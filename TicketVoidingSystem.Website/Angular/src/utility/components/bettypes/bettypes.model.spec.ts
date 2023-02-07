import { BetTypeModel, BallSequence, BetTypesModel } from "./bettypes.model";
import { Product } from '../..//constants/config';

describe('BetTypeModel', () => {
    const betTypeModel = new BetTypeModel('2702', '1H 1X2', false, 5, true);

    it('Rename NumberGame', () => {
      // Arrange
      let actualResult = '';
      const testCases = [
          { id: '85', name: 'test', expectedResult: 'Next test'},
          { id: '86', name: 'test', expectedResult: 'Next test'},
          { id: '87', name: 'test', expectedResult: 'test'},
      ]
      // Action and Asert
      testCases.forEach(item => {
        actualResult = betTypeModel.renameNumberGame(item.id, item.name);
        expect(actualResult).toBe(item.expectedResult);
      });
    });

    it('Get ball sequence', () => {
        // Arrange
        let actualResult = [];
        const testCases = [
            { id: '87', expectedResult: BallSequence.LiveSecondOrThird},
            { id: '88', expectedResult: BallSequence.LiveSecondOrThird},
            { id: '89', expectedResult: BallSequence.LiveAll},
        ]
        // Action and Asert
        testCases.forEach(item => {
          actualResult = betTypeModel.getBallSequence(item.id);
          expect(actualResult).toBe(item.expectedResult);
        });
      });

      it('Display NumberGame', () => {
        // Arrange
        const testCases = [
            { sportType: 161, ballSequence: BallSequence.LiveAll, id: '87', expectedResult: true },
            { sportType: 164, ballSequence: BallSequence.LiveAll, id: '8103', expectedResult: true },
            { sportType: 200, ballSequence: BallSequence.LiveAll, id: '123', expectedResult: false },
        ]
        // Action and Asert
        testCases.forEach(item => {
         betTypeModel.id = item.id;
         betTypeModel.ballSequence = item.ballSequence;
         betTypeModel.displayNumberGame(Product.NUMBER_GAME, item.sportType, item.ballSequence);
         expect(betTypeModel.isShow).toBe(item.expectedResult);
        });
      });
  });

  describe('BetTypesModel', () => {
    const betTypeModel = new BetTypeModel('2702', '1H 1X2', false, 5, false);
    const betTypesModel = new BetTypesModel([betTypeModel], true);

    it('Change All', () => {
      // Arrange
      // Action and Asert
      betTypesModel.changeAll();
      betTypesModel.bettypes.forEach(item => {
        expect(item.isChecked).toBe(true);
      });
    });

    it('Change item', () => {
        // Arrange
        betTypesModel.bettypes[0].isChecked = false;
        betTypesModel.bettypes[0].isShow = true;
        // Action and Asert
        betTypesModel.changeItem();
        expect(betTypesModel.isChecked).toBe(false);
    });
  });