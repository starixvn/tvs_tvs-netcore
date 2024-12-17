import { Selection } from '../../../utility/models/selection.model';

export class ManageProductConstant {
    static SportsBook = [{name: "Basketball", value: "1"},
                {name: "Cricket", value: "2"},
                {name: "E-Sports", value: "3"},
                {name: "Soccer", value: "4"},
                {name: "Other sports", value: "5"}
            ] as Selection[];
    static OtherProducts = {name: "Other products", value: "6"} as Selection;
    static MainParlay  = {name: "Main Parlay", value: "7"} as Selection;
}