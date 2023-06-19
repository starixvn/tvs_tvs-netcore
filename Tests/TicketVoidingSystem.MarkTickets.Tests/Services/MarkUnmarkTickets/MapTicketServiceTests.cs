using AutoMapper;
using Fanex.BetList.Core.Entities;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.MarkTickets.Tests.Services.MarkUnmarkTickets;

public class MapTicketServiceTests : IClassFixture<RemotingRefFixture>
{
    [Fact]
    public void MapToGroupTicketViewModel_WithPermission_ReturnTrue()
    {
        // Arrange
        var permission = new UserPermission { MarkTickets = false };
        var service = new CheckBoxServiceImp();

        // Act
        var actual = service.IsDisable(new GetTicketModel(), permission);

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public void MapToGroupTicketViewModel_HasNotTicket_DidNotCallBetListService()
    {
        // Arrange
        var groupTickets = new Group<GetTicketModel>();
        var mapper = Substitute.For<IMapper>();
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var service = new MapTicketServiceImp(mapper, betListService, checkBoxService);
        var userPermission = new UserPermission();

        // Act
        service.MapToGroupTicketViewModel(groupTickets, userPermission);

        // Assert
        betListService
            .DidNotReceive()
            .GetBetTypeName(Arg.Any<ITicket>());
    }

    [Fact]
    public void MapToGroupTicketViewModel_HasTickets_CallBetListService()
    {
        // Arrange
        const int transId = 123;
        var groupTickets = new Group<GetTicketModel>
        {
            Tickets = new List<GetTicketModel>
            {
                new() { TransId = transId }
            }
        };
        var mapper = Substitute.For<IMapper>();
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var service = new MapTicketServiceImp(mapper, betListService, checkBoxService);

        // Act
        service.MapToGroupTicketViewModel(groupTickets);

        // Assert
        betListService
            .Received(1)
            .GetBetTypeName(Arg.Any<ITicket>());
    }

    [Fact]
    public void MapToGroupTicketViewModel_GroupNameIsNotNullOrEmpty_ReturnGroupWithName()
    {
        // Arrange
        var groupTickets = new Group<GetTicketModel> { Name = "test" };
        var sessionService = Substitute.For<SessionService>();
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var service = new MapTicketServiceImp(TestSetup.CreateMapper(), sessionService, betListService, checkBoxService);

        // Act
        var actual = service.MapToGroupTicketViewModel(groupTickets);

        // Assert
        Assert.Equal(groupTickets.Name, actual.Name);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void MapToGroupTicketViewModel_ReturnGroupWithName(bool hasPermission)
    {
        // Arrange
        var groupTickets = new Group<GetTicketModel>
        {
            Name = "test",
            Tickets = new List<GetTicketModel>
            {
                new() { IsMixParlay = true, GroupName = SpecialSiteConstant.Site789Y },
                new() { IsMixParlay = true, GroupName = "" }
            }
        };
        var sessionService = Substitute.For<SessionService>();
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        sessionService.HasPermission(default, default).ReturnsForAnyArgs(hasPermission);

        var service = new MapTicketServiceImp(TestSetup.CreateMapper(), sessionService, betListService, checkBoxService);

        // Act
        var actual = service.MapToGroupTicketViewModel(groupTickets);

        // Assert
        Assert.Equal(groupTickets.Name, actual.Name);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void MapToExcelTicketModel_ReturnExcelTickets(bool hasPermission)
    {
        // Arrange
        var ticketsList = new List<GetTicketModel>
        {
            new() { TransId = 100000021, GroupName = SpecialSiteConstant.Site789Y, IsLiveIndicator = true, FollowedUsername = null, FollowedId = 2, Status = TicketStatus.Running },
            new() { TransId = 100000021, GroupName = SpecialSiteConstant.Site789Y, IsLiveIndicator = false, FollowedUsername = "A", FollowedId = 0, Status = TicketStatus.Won }
        };
        var sessionService = Substitute.For<SessionService>();
        var betListService = Substitute.For<BetListService>();

        sessionService.HasPermission(default, default).ReturnsForAnyArgs(hasPermission);
        var service = new MapTicketServiceImp(TestSetup.CreateMapper(), sessionService, betListService, null);

        // Act
        var actual = service.MapToExcelTicketModel(ticketsList);

        // Assert
        Assert.NotNull(actual);
    }
}