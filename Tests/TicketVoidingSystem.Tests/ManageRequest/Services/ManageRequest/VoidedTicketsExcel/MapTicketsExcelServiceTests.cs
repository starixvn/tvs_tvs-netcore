using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using TicketVoidingSystem.Services;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public class MapTicketsExcelServiceTests
{
	private readonly PagingService pagingService;
	private readonly MapFromBetListService mapFromBetListService;
	private readonly IMapper mapper;
	private MapTicketsExcelServiceImp service;

	public MapTicketsExcelServiceTests()
	{
		mapper = Substitute.For<IMapper>();
		pagingService = Substitute.For<PagingService>();
		mapFromBetListService = Substitute.For<MapFromBetListService>();

		service = new MapTicketsExcelServiceImp(pagingService, mapFromBetListService, mapper);
	}

	[Fact]
	public void MapToGroupVoidedTickets_TicketsIsEmpty_ReturnsEmptyList()
	{
		// Arrange
		var tickets = Enumerable.Empty<VoidedTicketModel>();

		// Act
		var result = service.MapToGroupVoidedTickets(tickets);

		// Assert
		Assert.Empty(result);
	}

	[Fact]
	public void MapToGroupVoidedTickets_hasTickets_ReturnsGroups()
	{
		// Arrange
		var tickets = new List<VoidedTicketModel>
		{
			new VoidedTicketModel { GroupName = "Group A", IsMixParlay = false },
			new VoidedTicketModel { GroupName = "Group B", IsMixParlay = false },
			new VoidedTicketModel { GroupName = "Group B", IsMixParlay = false },
			new VoidedTicketModel { GroupName = "Group C", IsMixParlay = true },
			new VoidedTicketModel { GroupName = "Group C", IsMixParlay = true },
			new VoidedTicketModel { GroupName = "Group C", IsMixParlay = true }
		};

		var groups = new List<Group<VoidedTicketModel>>
		{
			new Group<VoidedTicketModel> { Name = "Group A", Tickets = tickets.Take(1) },
			new Group<VoidedTicketModel> { Name = "Group B", Tickets = tickets.Skip(1).Take(2) },
			new Group<VoidedTicketModel> { Name = "Parlay", Tickets = tickets.Skip(3) },
		};
		pagingService.Groups(Arg.Any<IEnumerable<VoidedTicketModel>>(), Arg.Any<Func<VoidedTicketModel, string>>()).Returns(groups);

		// Act
		var result = service.MapToGroupVoidedTickets(tickets);

		// Assert
		Assert.Equal(4, result.Count());
	}

	[Fact]
	public void MapToGroupExcelVoidedTickets_ReturnsGroups()
	{
		// Arrange
		var originalGroup = new Group<VoidedTicketModel>
		{
			Name = "Group1",
			Tickets = new List<VoidedTicketModel>
			{
				new VoidedTicketModel { TransId = 1 },
				new VoidedTicketModel { TransId = 2 ,BetType = 38}
			}
		};
		var match = new Match();
		var startIndex = 1;
		var issueTypeId = 123;
		var excelTicket = new ExcelVoidedTicketModel { No = 1, BetId = "Bet1", Member = "Member1" };

		mapFromBetListService
			.MapToVoidedTicketViewModel(Arg.Any<VoidedTicketModel>(), Arg.Any<Match>(), ChoiceType.Excel, issueTypeId)
			.Returns(new VoidedTicketViewModel
			{
				Choice = "<span>abc</span>"
			});

		mapper.Map<ExcelVoidedTicketModel>(Arg.Any<VoidedTicketViewModel>()).Returns(excelTicket);
		//mapper.Map<ExcelVoidedTicketModel>(ticketDetail2).Returns(excelTicket2);

		// Act
		var result = service.MapToGroupExcelVoidedTickets(originalGroup, match, startIndex, issueTypeId);

		// Assert
		Assert.Equal(originalGroup.Name, result.Name);
		Assert.Equal(2, result.Tickets.Count());
	}
}