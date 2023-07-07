using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
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
    [InlineData(true, true)]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void MapToExcelTicketModel_ReturnExcelTickets(bool hasPermission, bool viewUserName)
    {
        // Arrange
        var ticketExpected = new Ticket();
        var ticketsList = new List<GetTicketModel> { new()
            {
            TransId = 100000021,
            GroupName = SpecialSiteConstant.Site789Y,
            IsLiveIndicator = true,
            FollowedUsername = "1",
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
        },
            new()
            {
                TransId = 100000021,
                GroupName = "1",
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
            }
        };
        var mapper = Substitute.For<IMapper>();
        var ticket = new ExcelTicketModel{Choice = null};
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(ticketExpected);
        mapper.Map<ExcelTicketModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(ticket);
        var betListService = Substitute.For<BetListService>();
        var checkBoxService = Substitute.For<CheckBoxService>();
        var userPermission = new UserPermission { MarkTickets = hasPermission, ViewUserName = viewUserName };
        var service = new MapTicketServiceImp(mapper, betListService, checkBoxService);
        betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("");
        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("");
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("");
        betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("");
        var excelTicketModel = new ExcelTicketModel
        {
            No = 2,
            Status = "",
            BetId = "100000021\r\n(Follow: 2)",
            Member = "",
            Odds = "",
            Stake = "",
            Choice = "",
            Currency = "",
        };
        var expected = new List<ExcelTicketModel>
        {
            excelTicketModel, excelTicketModel
        };

        // Act
        var actual = service.MapToExcelTicketModel(ticketsList, userPermission);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}