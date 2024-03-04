using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTicketsExcel;

public class MapTicketsExcelServiceTests
{
    private readonly MapFromBetListService mapFromBetListService;
    private readonly IMapper mapper;
    private readonly PagingService pagingService;
    private readonly MapTicketsExcelServiceImp service;

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
            new() { GroupName = "Group A", IsMixParlay = false },
            new() { GroupName = "Group B", IsMixParlay = false },
            new() { GroupName = "Group B", IsMixParlay = false },
            new() { GroupName = "Group C", IsMixParlay = true },
            new() { GroupName = "Group C", IsMixParlay = true },
            new() { GroupName = "Group C", IsMixParlay = true }
        };

        var groups = new List<Group<VoidedTicketModel>>
        {
            new() { Name = "Group A", Tickets = tickets.Take(1) },
            new() { Name = "Group B", Tickets = tickets.Skip(1).Take(2) },
            new() { Name = "Parlay", Tickets = tickets.Skip(3) }
        };
        pagingService.Groups(Arg.Any<IEnumerable<VoidedTicketModel>>(), Arg.Any<Func<VoidedTicketModel, string>>())
            .Returns(groups);

        // Act
        var result = service.MapToGroupVoidedTickets(tickets);

        // Assert
        Assert.Equal(4, result.Count());
    }

    [Theory]
    [InlineData(38, 11)]
    [InlineData(29, 13)]
    [InlineData(1, 13)]
    [InlineData(1, 1)]
    public void MapToGroupExcelVoidedTickets_ReturnsGroups(short betTypeId, int issueTypeId)
    {
        // Arrange
        var originalGroup = new Group<VoidedTicketModel>
        {
            Name = "Group1",
            Tickets = new List<VoidedTicketModel>
            {
                new() { TransId = 1 },
                new() { TransId = 2, BetType = betTypeId }
            }
        };
        var match = new Match();
        const int startIndex = 1;
        var excelTicket = new ExcelVoidedTicketModel { No = 1, BetId = "Bet1", Member = "Member1" };

        mapFromBetListService
            .MapToVoidedTicketViewModel(Arg.Any<VoidedTicketModel>(), Arg.Any<Match>(), ChoiceType.Excel, Arg.Any<GetVoidedTicketsQuery>())
            .Returns(new VoidedTicketViewModel
            {
                Choice = "<span>abc</span>"
            });

        mapper.Map<ExcelVoidedTicketModel>(Arg.Any<VoidedTicketViewModel>()).Returns(excelTicket);

        // Act
        var result = service.MapToGroupExcelVoidedTickets(originalGroup, match, startIndex, new GetVoidedTicketsQuery { IssueTypeId = issueTypeId });

        // Assert
        Assert.Equal(originalGroup.Name, result.Name);
        Assert.Equal(2, result.Tickets.Count());
    }
}