import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { BaseTicketsListComponent } from './base-tickets-list.component';
import { CommonGroupTicketsModel } from '../../../utility/models/common.group-tickets.model';
import { CommonTicketModel } from '../../../utility/models/common.ticket.model';
import { CommonTicketsModel } from '../../models/common.tickets.model';
import { PagingModel } from '../paging/paging.model';
import { ElementRef } from '@angular/core';

class Helper {
  static readonly fakePagingModel = {
    page: 1,
    pageSize: 10,
    totalItems: 100
  } as unknown as PagingModel;

  static readonly fakeCommonTicketModel = {
    id: 1,
    name: 'Test Ticket'
  } as unknown as CommonTicketModel;

  static readonly fakeCommonGroupTicketsModel: CommonGroupTicketsModel<CommonTicketModel> = {
    tickets: [Helper.fakeCommonTicketModel]
  } as CommonGroupTicketsModel<CommonTicketModel>;

  static readonly fakeCommonTicketsModel: CommonTicketsModel<CommonGroupTicketsModel<CommonTicketModel>> = {
    groups: [Helper.fakeCommonGroupTicketsModel]
  } as CommonTicketsModel<CommonGroupTicketsModel<CommonTicketModel>>;
}

describe('BaseTicketsListComponent', () => {
  let component: BaseTicketsListComponent<CommonTicketsModel<CommonGroupTicketsModel<CommonTicketModel>>>;
  let fixture: ComponentFixture<BaseTicketsListComponent<CommonTicketsModel<CommonGroupTicketsModel<CommonTicketModel>>>>;
  let elementRef: ElementRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseTicketsListComponent);
    component = fixture.componentInstance;
    elementRef = fixture.debugElement.injector.get(ElementRef);
    component.model = Helper.fakeCommonTicketsModel;
    component.paging = Helper.fakePagingModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isShowListCheckGroup).toBeFalsy();
    expect(component.showMessageBetTrade).toBeFalsy();
    expect(component.isBlock).toBeFalsy();
  });

  it('should show list check group when groups exist', () => {
    // Arrange
    component.model.groups = [Helper.fakeCommonGroupTicketsModel];
    component.model.updatePositionListCheckGroup = jest.fn();

    // Act
    component.showListCheckGroup();

    // Assert
    expect(component.isShowListCheckGroup).toBeTruthy();
    expect(component.model.updatePositionListCheckGroup).toHaveBeenCalledWith(elementRef);
  });

  it('should not show list check group when groups are empty', () => {
    // Arrange
    component.model.groups = [];
    component.model.updatePositionListCheckGroup = jest.fn();

    // Act
    component.showListCheckGroup();

    // Assert
    expect(component.isShowListCheckGroup).toBeFalsy();
    expect(component.model.updatePositionListCheckGroup).not.toHaveBeenCalled();
  });

  it('should handle body click event and hide list check group', () => {
    // Arrange
    component.isShowListCheckGroup = true;
    const mockEvent = new MouseEvent('click');
    const mockElement = document.createElement('div');
    mockElement.className = 'list-check-groups-input';
    elementRef.nativeElement.appendChild(mockElement);

    // Act
    document.body.dispatchEvent(mockEvent);

    // Assert
    expect(component.isShowListCheckGroup).toBeFalsy();
  });

  it('should emit export excel event', () => {
    // Arrange
    component.exportExcelEvent.emit = jest.fn();

    // Act
    component.exportExcel();

    // Assert
    expect(component.exportExcelEvent.emit).toHaveBeenCalled();
  });

  it('should emit paging event with current paging model', () => {
    // Arrange
    component.pagingChange.emit = jest.fn();

    // Act
    component.pagingEvent();

    // Assert
    expect(component.pagingChange.emit).toHaveBeenCalledWith(component.paging);
  });

  it('should handle click outside list check group', () => {
    // Arrange
    component.isShowListCheckGroup = true;
    const mockEvent = new MouseEvent('click');
    const mockElement = document.createElement('div');
    mockElement.className = 'list-check-groups-input';
    elementRef.nativeElement.appendChild(mockElement);
    const mockTarget = document.createElement('div');
    mockTarget.className = 'some-other-class';
    document.body.appendChild(mockTarget);
    Object.defineProperty(mockEvent, 'target', { value: mockTarget });

    // Act
    document.body.dispatchEvent(mockEvent);

    // Assert
    expect(component.isShowListCheckGroup).toBeFalsy();
  });
}); 