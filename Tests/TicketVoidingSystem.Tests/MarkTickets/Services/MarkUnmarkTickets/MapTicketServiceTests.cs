using System.Collections.Generic;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.MarkTickets.Constants;
using TicketVoidingSystem.MarkTickets.Models;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Services.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.MarkTickets.Services.MarkUnmarkTickets;

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
        var ticketExpected = new Ticket();
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(ticketExpected);
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var service = new MapTicketServiceImp(mapper, betListService, checkBoxService);
        var userPermission = new UserPermission();

        // Act
        service.MapToGroupTicketViewModel(groupTickets, userPermission);

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
        var mapper = Substitute.For<IMapper>();
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var service = new MapTicketServiceImp(mapper, betListService, checkBoxService);
        var userPermission = new UserPermission();

        // Act
        var actual = service.MapToGroupTicketViewModel(groupTickets, userPermission);

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
        var mapper = Substitute.For<IMapper>();
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var ticketExpected = new Ticket();
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(ticketExpected);
        var userPermission = new UserPermission { MarkTickets = hasPermission };
        var service = new MapTicketServiceImp(mapper, betListService, checkBoxService);

        // Act
        var actual = service.MapToGroupTicketViewModel(groupTickets, userPermission);

        // Assert
        Assert.Equal(groupTickets.Name, actual.Name);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void MapToExcelTicketModel_ReturnExcelTickets(bool hasPermission)
    {
        var ticketExpected = new Ticket();
        var ticketModel = new GetTicketModel
        {
            TransId = 100000021,
            GroupName = SpecialSiteConstant.Site789Y,
            IsLiveIndicator = true,
            FollowedUsername = null,
            FollowedId = 2,
            Status = TicketStatus.Running,
            SubTransId = 1,
            BetType = 1,
            OddsType = 1,
            Hdp1 = 1,
            Hdp2 = 1,
            RefNo = 1,
            WalletType = 1,
            IsMixParlay = false,
        };
        // Arrange
        var ticketsList = new List<GetTicketModel> { ticketModel, ticketModel };
        var mapper = Substitute.For<IMapper>();
        var ticket = new ExcelTicketModel();
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(ticketExpected);
        mapper.Map<ExcelTicketModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(ticket);
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var userPermission = new UserPermission { MarkTickets = hasPermission };
        var service = new MapTicketServiceImp(mapper, betListService, checkBoxService);

        // Act
        var actual = service.MapToExcelTicketModel(ticketsList, userPermission);

        // Assert
        Assert.NotNull(actual);
    }
}