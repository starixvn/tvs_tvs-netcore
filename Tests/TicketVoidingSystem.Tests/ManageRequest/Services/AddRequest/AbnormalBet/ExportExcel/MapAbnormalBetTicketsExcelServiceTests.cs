using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;

public class MapAbnormalBetTicketsExcelServiceTests
{
    private readonly BetListService betListService;
    private readonly IMapper mapper;
    private readonly RemotingRefWrapperService remotingRefWrapperService;
    private readonly MapAbnormalBetTicketsExcelServiceImp service;

    public MapAbnormalBetTicketsExcelServiceTests()
    {
        mapper = Substitute.For<IMapper>();
        betListService = Substitute.For<BetListService>();
        remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        service = new MapAbnormalBetTicketsExcelServiceImp(mapper, remotingRefWrapperService, betListService);
    }

    [Fact]
    public void MapDataToAbnormalBetTicketViewModel_HasNoTicket_ReturnExpected()
    {
        // Arrange
        var tickets = new List<GetAbnormalBetTicketModel>();

        // Act
        var result = service.MapDataToAbnormalBetTicketViewModel(tickets);

        // Assert
        Assert.Empty(result);
    }

    [Theory]
    [InlineData("", 0, 0, false)]
    [InlineData(TicketStatus.Running, 1, 38, true)]
    [InlineData(TicketStatus.Running, 0, 1, false)]
    public void MapDataToAbnormalBetTicketViewModel_HasTickets_ReturnExpected(string status, int sportType,
        short betType, bool isMixParlay)
    {
        // Arrange
        var tickets = new List<GetAbnormalBetTicketModel>
        {
            new()
            {
                MatchId = 1, TransId = 1, RemarkId = 1, LeagueId = 1, HomeId = 1, AwayId = 1,
                TransDate = DateTimeOffset.Now.DateTime, UserName = "a", Status = status, WinLost = "100",
                IsLiveIndicator = true, IsVipMember = true, CustomerClass = 1
            },
            new() { MatchId = null, TransId = 2, RemarkId = 0 },
            new()
            {
                MatchId = 1, TransId = 3, RemarkId = 1, LeagueId = 1, HomeId = 1, AwayId = 1,
                TransDate = DateTimeOffset.Now.DateTime, UserName = "a", Status = status, WinLost = "100",
                IsLiveIndicator = false, IsVipMember = false, CustomerClass = null
            }
        };
        var getTicketModel = new GetTicketModel { BetType = betType, SportType = sportType, IsMixParlay = isMixParlay };
        remotingRefWrapperService.GetLeagueName(1, LanguageCode.English).ReturnsForAnyArgs("LeagueName");
        remotingRefWrapperService.GetTeamName(1, LanguageCode.English).ReturnsForAnyArgs("1");
        betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("odds");
        betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("BetTypeName");
        betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("");
        betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("");
        mapper.Map<GetTicketModel>(Arg.Any<GetAbnormalBetTicketModel>()).ReturnsForAnyArgs(getTicketModel);
        mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());
        mapper.Map<AbnormalBetTicketViewModel>(Arg.Any<GetAbnormalBetTicketModel>())
            .ReturnsForAnyArgs(new AbnormalBetTicketViewModel());

        // Act
        var result = service.MapDataToAbnormalBetTicketViewModel(tickets);

        // Assert
        Assert.Equal(3, result.Count());
    }
}