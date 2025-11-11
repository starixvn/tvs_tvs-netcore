import { ItemsSelectService } from '../multiple-selection/items-select.service';
import { CheckedBetType } from './advanced-mode/advanced-mode.model';

export class AdvancedModeConstants {
    static readonly RUNS_SELECTION: CheckedBetType[] = [
        { value: 'All', betTeam: 'All', valueHdp1: 'All' } as CheckedBetType,
        { value: '0', betTeam: '0', valueHdp1: '0' } as CheckedBetType,
        { value: '1', betTeam: '1', valueHdp1: '1' } as CheckedBetType,
        { value: '2', betTeam: '2', valueHdp1: '2' } as CheckedBetType,
        { value: '3', betTeam: '3', valueHdp1: '3' } as CheckedBetType,
        { value: '< 4', betTeam: '0', valueHdp1: '4' } as CheckedBetType,
        { value: '4', betTeam: '1,2,3,4,5,6,7', valueHdp1: '4' } as CheckedBetType,
        { value: '5', betTeam: 'All', valueHdp1: '5' } as CheckedBetType,
        { value: '< 6', betTeam: '0', valueHdp1: '6' } as CheckedBetType,
        { value: '6', betTeam: '1,2,3,4,5,6', valueHdp1: '6' } as CheckedBetType,
        { value: '> 6', betTeam: '7', valueHdp1: '6' } as CheckedBetType,
        { value: '7', betTeam: 'All', valueHdp1: '7' } as CheckedBetType,
        { value: '< 8', betTeam: '0', valueHdp1: '8' } as CheckedBetType,
        { value: '8', betTeam: '1,2,3,4,5,6,7', valueHdp1: '8' } as CheckedBetType,
        { value: '9', betTeam: '0,1,2,3,4,5,6', valueHdp1: '9' } as CheckedBetType, // NOSONAR
        { value: '> 9', betTeam: '7', valueHdp1: '9' } as CheckedBetType,
        { value: '10', betTeam: 'All', valueHdp1: '10' } as CheckedBetType,
        { value: '11', betTeam: '0,1,2,3,4,5,6', valueHdp1: '11' } as CheckedBetType,
        { value: '> 11', betTeam: '7', valueHdp1: '11' } as CheckedBetType,
        { value: '12', betTeam: 'All', valueHdp1: '12' } as CheckedBetType,
        { value: '13', betTeam: '0,1,2,3,4,5,6', valueHdp1: '13' } as CheckedBetType,
        { value: '> 13', betTeam: '7', valueHdp1: '13' } as CheckedBetType,
    ];

    static readonly MAP_LIST = [
        ItemsSelectService.initItemsSelect(0, '801', '1', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '802', '2', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '803', '3', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '804', '4', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '805', '5', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '806', '6', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '807', '7', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '808', '8', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '809', '9', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '810', '10', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '811', '11', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '812', '12', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '813', '13', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '814', '14', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '815', '15', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '816', '16', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '817', '17', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '818', '18', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '819', '19', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '820', '20', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '821', '21', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '822', '22', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '823', '23', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '824', '24', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '825', '25', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '826', '26', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '827', '27', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '828', '28', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '829', '29', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '830', '30', true, true, true, [])
    ];

    static readonly ROUND_LIST = [
        ItemsSelectService.initItemsSelect(0, '01', '1', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '02', '2', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '03', '3', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '04', '4', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '05', '5', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '06', '6', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '07', '7', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '08', '8', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '09', '9', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '10', '10', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '11', '11', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '12', '12', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '13', '13', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '14', '14', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '15', '15', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '16', '16', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '17', '17', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '18', '18', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '19', '19', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '20', '20', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '21', '21', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '22', '22', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '23', '23', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '24', '24', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '25', '25', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '26', '26', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '27', '27', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '28', '28', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '29', '29', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '30', '30', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '>30', 'Others', true, true, true, [])
    ];
    static readonly QUARTER_LIST = [
        ItemsSelectService.initItemsSelect(0, '801', '1', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '802', '2', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '803', '3', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '804', '4', true, true, true, [])
    ];
    static readonly SET_LIST = [
        ItemsSelectService.initItemsSelect(0, '801', '1', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '802', '2', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '803', '3', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '804', '4', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '805', '5', true, true, true, [])
    ];
    static readonly GAME_LIST = [
        ItemsSelectService.initItemsSelect(0, '801', '1', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '802', '2', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '803', '3', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '804', '4', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '805', '5', true, true, true, [])
    ];
    static readonly INNING_LIST = [
        ItemsSelectService.initItemsSelect(0, '801', '1', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '802', '2', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '803', '3', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '804', '4', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '805', '5', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '806', '6', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '807', '7', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '808', '8', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '809', '9', true, true, true, []),
        ItemsSelectService.initItemsSelect(0, '810', '10', true, true, true, [])
    ];
    static readonly ATTRIBUTE_HDP = 'ATTRIBUTE_HDP';
    static readonly ATTRIBUTE_ODDS_SPREAD = 'ATTRIBUTE_ODDS_SPREAD';

    static readonly MAP = 'Map:';
    static readonly ROUND = 'Round:';
    static readonly GAME = 'Game:';
    static readonly SET = 'Set:';
    static readonly QUARTER = 'Quarter:';
    static readonly INNING = 'Inning:';
    static readonly BETTYPES_SABA_TIME_MACHINE = '228,229';
    static readonly BETTYPES_MORE_HDP = '1,7,1303,3,8,183,153,1308,1306,17,701,704,637,8800,8829';
    static readonly BETTYPES_UPDATE_ONLY_GAME_ATTRIBUTE = '613,712,713,3909,3912,3916';
    static readonly BETTYPES_CRICKET_UPDATE_FANCY = '9541,9542,9543,9544,9545,9546,9566,9567,9569,9570,9572,9573,9574,9575,9580,9581,9606,9728,9729'
        + ',9576,9577,9578,9579,9582,9583,9584,9585'
        + ',9547,9548,9549,9550,9551,9552,9553,9554,9559,9560,9561,9562,9563,9564'
        + ',9722,9723,9724,9725,9726,9727,9714,9715,9716,9719,9720,9721'
        + ',9712,9713,9717,9718,9728,9729';
    static readonly BETTYPES_CRICKET_UPDATE_BALL_DELIVERY_AND_OVER = '9422,9423,9613,9614,9616,9617';
    static readonly BETTYPES_OVER_X_BALL_Y_EXACT_RUNS = '9490,9491';
    static readonly BETTYPES_CRICKET_UPDATE_OVER_OR_WICKET = '9410,9411,9412,9413,9414,9415,9416,9417,9418,9419,9420,9421,9428,9429,9430,9431,9432,9433'
        + ',9434,9435,9436,9437,9438,9439,9502,9503,9504,9505,9506,9507,9508,9509,9510,9511,9512,9513,9514,9515,9516,9517,9518,9519'
        + ',9547,9548,9549,9550,9551,9552,9553,9554,9559,9560,9561,9562,9563,9564,9607,9608,9609,9610,9611,9612'
        + ',9636,9637,9638,9639,9640,9641,9722,9723,9724,9725,9726,9727,9618,9619,9620,9621,9622,9623,9484,9485,9486,9487,9488,9489'
        + ',9624,9625,9626,9627,9628,9629,9630,9631,9632,9633,9634,9635';
    static readonly BETTEAM_TYPE_4 = 4;
    static readonly BETTEAM_TYPE_5 = 5;
    static readonly BETTYPE_PENALTY_SHOOTOUT_COMBO = '376';
    static readonly BETTYPE_EXTRA_TIME_NEXT_GOAL_OWN = '396';
    static readonly BETTYPE_QUARTER_X_1X2 = '630';
    static readonly BETTYPE_HALF_FULL_TIME_CORRECT_SCORE = '152';
    static readonly BETTYPE_HALF_FULL_TIME_CORRECT_SCORE_AOS = '416';
    static readonly BETTYPE_MAP_X_FIRST_TO_Y_OVER_UNDER = '9089';
    // cricket phase2
    static readonly BETTYPE_OVER_X_EXACT_RUNS = '9484,9485,9486,9487,9488,9489';
    static readonly BETTYPE_NEXT_MAN_OUT = '9662,9664,9666,9663,9665,9667';
    static readonly BETTYPE_CRICKET_WITH_PLAYER = '9680,9682,9684,9696,9698,9702,9704,9730,9732,9734,9736,9738,9690,9692,9694,9697,9699,9703,9705,9731,9733,9735,9737,9739'
    + ',9681,9683,9685,9691,9693,9695,9714,9715,9716,9719,9720,9721,9650,9652,9654,9656,9658,9660,9651,9653,9655,9657,9659,9661,9662,9664,9666,9663,9665,9667'
    + ',9676,9678,9686,9688,9677,9679,9687,9689,9712,9713,9717,9718,9668,9669,9670,9671,9672,9673,9674,9675';
    static readonly BETTYPE_SPECIAL_BASKETBALL = '653,654,655,685,656,657,658,686,659,660,661,687,662,663,664,688,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684';
    static readonly BETTYPE_POINTS_BASKETBALL = '653,655,685,656,658,686,659,661,687,662,664,688,665,667,669,671';
    static readonly BETTYPE_OTHERS_BASKETBALL = '675,676,678';
    static readonly BETTYPE_MOST_BASKETBALL = '680,681,682,683,684';
    static readonly BETTYPE_BASKETBALL_SELECT_BETCHOICE = '653,655,656,658,659,661,662,664,665,667,669,671,685,686,687,688';
}
