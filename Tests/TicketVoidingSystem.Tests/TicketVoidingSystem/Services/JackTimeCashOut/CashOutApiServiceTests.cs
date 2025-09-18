using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.JackTimeCashOut;

public class CashOutApiServiceTests
{
    private readonly CashOutHttpClientService cashOutHttpClientService;
    private readonly LoggingService loggingService;
    private readonly CashOutApiServiceImp service;

    public CashOutApiServiceTests()
    {
        cashOutHttpClientService = Substitute.For<CashOutHttpClientService>();
        loggingService = Substitute.For<LoggingService>();
        service = new CashOutApiServiceImp(cashOutHttpClientService);
    }

    [Fact]
    public async Task VoidBet_HasCalled_AlwaysCalledPostRequest()
    {
        // Arrange
        var requestModel = new CashOutApiModel();

        // Act
        await service.VoidBet(requestModel);

        // Assert
        await cashOutHttpClientService.Received(1).PostRequest("VoidBet", Arg.Any<CashOutApiModel>());
    }

    [Fact]
    public async Task UndoVoidBet_HasCalled_AlwaysCalledPostRequest()
    {
        // Arrange
        var requestModel = new CashOutApiModel();

        // Act
        await service.UndoVoidBet(requestModel);

        // Assert
        await cashOutHttpClientService.Received(1).PostRequest("UndoVoidBet", Arg.Any<CashOutApiModel>());
    }

    [Fact]
    public async Task VoidBetForCashOutBasketball_HasValidTickets_HasCalledPostRequest()
    {
        // Arrange
        var tickets = new List<TicketEmailModel>
        {
            new() { IsCashOut = true, SportTypeId = SportTypeConstant.Basketball, TransId = 1, CustId = 1, ExtraInfo = "<p25 jtseqid='1'/>" },
            new() { IsCashOut = true, SportTypeId = SportTypeConstant.Basketball, TransId = 2, CustId = 2, ExtraInfo = "<p25 jtseqid='1'/>" },
            new() { IsCashOut = false, SportTypeId = SportTypeConstant.Basketball, TransId = 2, CustId = 2 },
            new() { IsCashOut = true, SportTypeId = SportTypeConstant.CashOut, TransId = 2, CustId = 2, ExtraInfo = "<p25 jtseqid='1'/>" },
            new() { IsCashOut = false, SportTypeId = SportTypeConstant.CashOut  , TransId = 2, CustId = 2 }
        };

        // Act
        await service.VoidBet(tickets);

        // Assert
        await cashOutHttpClientService.Received(1).PostRequest("VoidBet", Arg.Any<CashOutApiModel>());
    }

    [Fact]
    public async Task VoidBetForCashOutBasketball_NoHasBasketballCashOutTickets_NoHasCalledPostRequest()
    {
        // Arrange
        var tickets = new List<TicketEmailModel>
        {
            new() { IsCashOut = false, SportTypeId = SportTypeConstant.Basketball, TransId = 2, CustId = 2 },
            new() { IsCashOut = true, SportTypeId = SportTypeConstant.CashOut, TransId = 2, CustId = 2 },
            new() { IsCashOut = false, SportTypeId = SportTypeConstant.CashOut  , TransId = 2, CustId = 2 }
        };

        // Act
        await service.VoidBet(tickets);

        // Assert
        await cashOutHttpClientService.Received(0).PostRequest("VoidBet", Arg.Any<CashOutApiModel>());
    }
}