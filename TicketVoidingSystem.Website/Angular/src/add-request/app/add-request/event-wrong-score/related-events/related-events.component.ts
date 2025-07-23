import { Component, ElementRef, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { LogInfoRelatedEventComponent } from '../../components/log-info-related-event/log-info-related-event.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { RelatedEventService } from '../services/related-event.service';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { MatchType } from '../../../../../utility/constants/config';
import { AddChildMatchModel } from '../../../../../utility/components/add-child-match/add-child-match.model';
import { AddChildMatchComponent } from '../../../../../utility/components/add-child-match/add-child-match.component';
import { EventWrongScoreService } from '../services/event-wrong-score.service';
import _ from 'lodash';
import { OnlyNumberDirective } from '../../../../../utility/directives/number.directive';

@Component({
  standalone: true,
  selector: 'related-events',
  templateUrl: './related-events.component.html',
  styleUrl: './related-events.component.scss',
  imports: [LogInfoRelatedEventComponent, CommonModule, FormsModule, AddChildMatchComponent, OnlyNumberDirective],
  providers: [RelatedEventService, EventWrongScoreService]
})
export class RelatedEventsComponent {
  @Input() relatedEvents: LogInfoRelatedEvent[];
  @Input() filter: FilterModel;
  @Input() isEdit: boolean;
  @Input() primitiveProps: PrimitiveProperty;
  @Input() issueTypes: IssueTypes;
  @Input() defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  @Input() requestId: number;
  @Input() mainEvent: LogInfoRelatedEvent;
  @ViewChildren('logInfo') logInfoComponents: QueryList<LogInfoRelatedEventComponent>;
  @Output() clearInfoSiteDBDownModel = new EventEmitter<void>();
  
  childEvents: ChildMatchModel[] = [];
  tooltip = new Tooltip(); 
  addChildMatchModel = new AddChildMatchModel();
  
  private readonly INPUT_MATCH_ID_CLASS = 'input-related-match-id';
  private readonly element = inject(ElementRef);
  private readonly relatedEventService = inject(RelatedEventService);
  private readonly eventWrongScoreService = inject(EventWrongScoreService);
  
  constructor() {
    this.tooltip.element = this.element;
  }

  async handleClickAddRelatedEvent(): Promise<void> {
    await this.relatedEventService.addRelatedEventByInput(this.initAddRelatedEventArgs());
  }

  private initAddRelatedEventArgs() {
    const arg = new AddRelatedEventArg();
    arg.tooltip = this.tooltip;
    arg.requestId = this.requestId;
    arg.isEdit = this.isEdit;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.defaultFilterTimeWithAllowance = this.defaultFilterTimeWithAllowance;
    arg.relatedEvents = this.relatedEvents;
    arg.mainEvent = this.mainEvent;
    arg.inputMatchIdClass = this.INPUT_MATCH_ID_CLASS;

    return arg;
  }

  isDisabledChildMatches(): boolean {
    return this.filter.isVoided || this.childEvents.filter(x => x.matchType === MatchType.CHILD).length === 0;
  }

  showAddChildMatchModal(matchType: number) {
    this.addChildMatchModel.selectedMatchIds = this.relatedEvents.map(x => x.matchId);
    this.addChildMatchModel.matchType = matchType;
    this.addChildMatchModel.isOpen = true;
    this.addChildMatchModel = _.clone(this.addChildMatchModel);
  }

  countChildMatches(): number {
    return this.childEvents.filter(x => x.matchType === MatchType.CHILD).length;
  }

  countLinkMatches(): number {
    return this.childEvents.filter(x => x.matchType === MatchType.LINK).length;
  }

  isDisabledLinkMatches(): boolean {
    return this.filter.isVoided || this.childEvents.filter(x => x.matchType === MatchType.LINK).length === 0;
  }
  
  handleDeleteEvent(matchId: number): void {
    this.relatedEvents = this.relatedEvents.filter(x => x.matchId !== matchId);
    this.clearInfoSiteDBDownModelEvent();
  }

  async saveRelatedEvent(selectedRelatedEvents: ChildMatchModel[]): Promise<void> {
    this.primitiveProps.isBlock = true;
    this.relatedEvents = this.eventWrongScoreService.updateCheckRelatedEvent(selectedRelatedEvents, this.relatedEvents, this.childEvents, this.addChildMatchModel.matchType);
    const newChildEvents = selectedRelatedEvents.filter(x => !this.relatedEvents.some(y => y.matchId === x.matchId));
    if (newChildEvents.length > 0) {
      await this.relatedEventService.addEventByInputAndSelected(newChildEvents, this.initAddRelatedEventArgs());
      this.relatedEvents = _.orderBy(_.uniqBy(this.relatedEvents, x => x.matchId), ['matchCode'], ['asc']);
    }
    this.clearInfoSiteDBDownModelEvent();
    this.primitiveProps.isBlock = false;
  }

  async getDataWhenSearch(): Promise<void> {
    this.childEvents = await this.relatedEventService.getGetInfoChildMatch(this.mainEvent.matchId, true, this.mainEvent.sportType, this.mainEvent.eventDate.toString());
    await this.relatedEventService.getDataRelatedEventWhenSearch(this.childEvents, this.initAddRelatedEventArgs());
    this.relatedEvents = _.orderBy(_.uniqBy(this.relatedEvents, x => x.matchId), ['matchCode'], ['asc']);
    this.logInfoComponents.forEach(x => {
      x.filterTimeWithAllowanceComponent?.updateData();
      x.showValidationDetail();
    });
  }

  resetData(){
    this.relatedEvents = [];
    this.childEvents = [];
    this.addChildMatchModel = new AddChildMatchModel();
    this.primitiveProps.isShowRelatedEvents = false;
  }

  clearInfoSiteDBDownModelEvent(): void {
    this.clearInfoSiteDBDownModel.emit();
  }
}
