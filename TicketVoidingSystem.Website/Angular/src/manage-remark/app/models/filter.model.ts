import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Selection } from '../../../utility/models/selection.model';
import { MultipleSelection } from 'src/utility/components/multiple-selection/multiple-selection.model';

export class FilterModel {
  searchBy = "0"; // 0: MatchId, 1: RemarkId
  remarkId?: number;
  matchId?: number;
  ngbFromDate: NgbDate;
  ngbToDate: NgbDate;
  createdBy: string;
  isExcludeTest = true;

  // Section for filter
  userId: string;
  createdBySelectList: Selection[];
  actionSelectList: MultipleSelection;
}
