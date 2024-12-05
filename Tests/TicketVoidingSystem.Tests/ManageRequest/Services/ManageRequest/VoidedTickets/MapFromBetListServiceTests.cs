using System;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.Templates;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTickets;

public class MapFromBetListServiceTests : IClassFixture<RemotingRefFixture>
{
    private readonly BetListService betListService;
    private readonly IMapper mapper;
    private readonly MapFromBetListServiceImp service;

    public MapFromBetListServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        betListService = Substitute.For<BetListService>();
        service = new MapFromBetListServiceImp(mapper, betListService);
    }

    [Fact]
    public void MapToVoidedTicketViewModel_ShouldMapProperties_WhenBetTypeInRange()
    {
        // Arrange
        var item = new VoidedTicketModel
        {
            BetType = 803,
            RefNo = 123456,
            UserName = "testUser",
            WinLost = "100.50",
            CurrencyName = "CurrencyName",
            Creator = "Creator",
            IsCashOut = true,
            IsMixParlay = false,
            OddsType = 1,
            WalletType = 1,
            BetdaqId = 2,
            Status = "running",
            TransDate = new DateTime(2022, 2, 2, 2, 2, 2),
            VoidedTime = new DateTime(2022, 2, 2, 2, 2, 2)
        };
        var match = new Match();
        const ChoiceType choiceType = ChoiceType.Excel;

        var ticket = new Ticket
        {
            UserName = "testUser",
            TransDate = new DateTime(2022, 2, 2, 2, 2, 2)
        };

        var expected = new VoidedTicketViewModel
        {
            Odds = "Odds",
            Handicap = "Handicap",
            Stake = "Stake",
            BetType = "BetType",
            Status = "Status",
            Creator = "Creator",
            Currency = "CurrencyName",
            WinLoss = "-",
            BetId = "123456",
            TransDate = new DateTime(2022, 2, 2, 2, 2, 2).ToString(FormatKey.LongDateFormatTimeWithSlash),
            Member = "testUser",
            Score = "",
            Choice = "",
            VoidTime = new DateTime(2022, 2, 2, 2, 2, 2).ToString(FormatKey.LongDateFormatTimeWithSlash),
            BettypeCombination = "Non-Live BetType (betTeam)",
            IsCashOut = true
        };

        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("Odds");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("Handicap");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("Stake");
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetType");
        betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Status");
        betListService.BuildChoiceExcel(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("Choice");
        betListService.BuildChoiceBlock(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs(new Choice_Template { betTeam = "betTeam" });

        mapper.Map<Ticket>(Arg.Any<VoidedTicketModel>()).ReturnsForAnyArgs(ticket);

        // Act
        var result = service.MapToVoidedTicketViewModel(item, match, choiceType, new GetVoidedTicketsQuery());

        // Assert
        AssertExtension.Equal(expected, result);
    }

    [Theory]
    [InlineData(IssueTypeConstant.AbnormalAccount, "<div id=1><div id='divEvent_11'></div>")]
    public void MapToVoidedTicketViewModel_HasGetChoiceForTicketParlay(int issueTypeId, string choice)
    {
        // Arrange
        var item = new VoidedTicketModel
        {
            BetType = 9,
            RefNo = 123456,
            UserName = "testUser",
            WinLost = "100.50",
            CurrencyName = "CurrencyName",
            Creator = "Creator",
            IsCashOut = false,
            IsMixParlay = true,
            OddsType = 1,
            WalletType = 1,
            BetdaqId = 2,
            Status = "running",
            TransDate = new DateTime(2022, 2, 2, 2, 2, 2),
            VoidedTime = new DateTime(2022, 2, 2, 2, 2, 2),
            SubTransId = 11
        };

        const ChoiceType choiceType = ChoiceType.Email;

        var ticket = new Ticket
        {
            UserName = "testUser",
            TransDate = new DateTime(2022, 2, 2, 2, 2, 2)
        };

        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("Odds");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("Handicap");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("Stake");
        //betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetType");
        betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("Status");
        betListService.BuildChoiceExcel(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("choice");
        betListService.BuildChoiceBlock(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs(new Choice_Template { betTeam = "betTeam" });
        betListService.BuildChoice(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false)
            .ReturnsForAnyArgs("<div id=1>");
        mapper.Map<Ticket>(Arg.Any<VoidedTicketModel>()).ReturnsForAnyArgs(ticket);

        // Act
        var result = service.MapToVoidedTicketViewModel(item, null, choiceType, new GetVoidedTicketsQuery { IssueTypeId = issueTypeId });

        // Assert
        AssertExtension.Equal(choice, result.Choice);
    }
}