using System.Threading.Tasks;
using Xunit;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services;
using System.Collections.Generic;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Constants;
using System;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.JackTimeCashOut
{
    public class CashOutApiServiceTests
    {
        private readonly CashOutHttpClientService cashOutHttpClientService;
        private readonly LoggingService loggingService;
        private readonly CashOutApiServiceImp service;

        public CashOutApiServiceTests()
        {
            cashOutHttpClientService = Substitute.For<CashOutHttpClientService>();
            loggingService = Substitute.For<LoggingService>();
            service = new CashOutApiServiceImp(cashOutHttpClientService, loggingService);
        }

        [Fact]
        public async Task VoidBet_HasCalled_AlwaysCalledPostRequest()
        {
            // Arrange
            var requestModel = new CashOutApiModel { };            

            // Act
            await service.VoidBet(requestModel);

            // Assert
            await cashOutHttpClientService.Received(1).PostRequest("VoidBet", Arg.Any<CashOutApiModel>()); 
        }

        [Fact]
        public async Task UndoVoidBet_HasCalled_AlwaysCalledPostRequest()
        {
            // Arrange
            var requestModel = new CashOutApiModel { };

            // Act
            await service.UndoVoidBet(requestModel);

            // Assert
            await cashOutHttpClientService.Received(1).PostRequest("UndoVoidBet", Arg.Any<CashOutApiModel>());
        }

        [Fact]
        public async Task VoidBetForCashOutBasketball_HasValidTickets_HasCalledPostRequest( )
        {
            // Arrange
            var tickets = new List<TicketEmailModel> { 
                new TicketEmailModel { IsCashOut  = true, SportTypeId  = SportTypeConstant.Basketball, TransId = 1, CustId = 1 } ,
                new TicketEmailModel { IsCashOut  = true, SportTypeId  = SportTypeConstant.Basketball, TransId = 2, CustId = 2 }
            };

            // Act
            await service.VoidBetForCashOutBasketball(tickets);

            // Assert
            await cashOutHttpClientService.Received(1).PostRequest("VoidBet", Arg.Any<CashOutApiModel>());
        }

        [Fact]
        public async Task VoidBetForCashOutBasketball_HasTicketsIsNull_HasErrorAsync()
        {
            // Arrange

            // Act
            await service.VoidBetForCashOutBasketball(null);

            // Assert
            await loggingService.Received(1).ErrorAsync("VoidBetForCashOutBasketball", Arg.Any<Exception>());
        }
    }
}
