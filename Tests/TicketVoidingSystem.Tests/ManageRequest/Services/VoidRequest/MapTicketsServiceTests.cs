using System;
using System.Collections.Generic;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Models.Parameters;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest;

public class MapTicketsServiceTests
{
    private readonly BetListCoreService betListCoreService;
    private readonly MapTicketsServiceImp service;

    public MapTicketsServiceTests()
    {
        betListCoreService = Substitute.For<BetListCoreService>();
        service = new MapTicketsServiceImp(betListCoreService);
    }

    [Fact]
    public void MapToGroupTicketViewModel_HasCall_ReturnTicketViewModel()
    {
        // Arrange
        var ticket1 = new GetTicketModel
        {
            TransDate = new DateTime(2022, 9, 5, 1, 1, 1),
            Status = "done",
            MainTransId = 1,
            SubTransId = 1,
            TransId = 1
        };
        var ticket2 = new GetTicketModel
        {
            IsLiveIndicator = true,
            FollowedUsername = "123",
            FollowedId = 1,
            Status = TicketStatus.Running,
            IsMixParlay = true,
            TransDate = new DateTime(2022, 9, 5, 1, 1, 1),
            MainTransId = 2,
            SubTransId = 1,
            TransId = 1
        };
        var group = new Group<GetTicketModel>
        {
            Name = "123",
            DisplayTotalTickets = 1,
            Tickets = new List<GetTicketModel> { ticket1, ticket2 }
        };
        var query = new GroupTicketsMappingParameters
        {
            Group = group,
            VoidPermission = new VoidPermission(),
            Match = new Match(),
            IssueTypeId = 1
        };

        var model1 = new TicketViewModel { MainTransId = "1" };
        var model2 = new TicketViewModel { MainTransId = "2" };
        betListCoreService.GetTicket(ticket1, Arg.Any<Match>(), Arg.Any<ChoiceType>(), 1)
            .Returns(model1);
        betListCoreService.GetTicket(ticket2, Arg.Any<Match>(), Arg.Any<ChoiceType>(), 1)
            .Returns(model2);
        var tickets = new List<TicketViewModel>
        {
            new()
            {
                TransDate = new DateTime(2022, 9, 5, 1, 1, 1).ToString(FormatKey.DateTimeWithMillisecondAndSlash),
                BetId = "1", Value = "1", MainTransId = "1", WinLoss = "0", Score = null, IsDisable = true
            },
            new()
            {
                No = 1, IsParlay = true,
                TransDate = new DateTime(2022, 9, 5, 1, 1, 1).ToString(FormatKey.DateTimeWithMillisecondAndSlash),
                BetId = "1<br>(Follow: 1)", Value = "1", MainTransId = "2", WinLoss = "-", Score = null, IsDisable = true,
                Member = "<br>(Follow: 123)"
            }
        };

        var expected = new Group<TicketViewModel>
        {
            Name = "123",
            Tickets = tickets,
            DisplayTotalTickets = 1
        };

        // Act
        var result = service.MapToGroupTicketViewModel(query);

        // Assert
        AssertExtension.Equal(expected, result);
    }
}