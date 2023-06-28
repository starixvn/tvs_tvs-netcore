using Xunit;
using NSubstitute;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using System.Collections.Generic;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using System;
using TicketVoidingSystem.Models;
using System.Linq;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using BetListNPOI.SS.Formula.Functions;
using Microsoft.Extensions.Configuration;
using Fanex.MailDeliver.MailClient;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet
{
    public class UusTicketServiceTests : AppSettingFixture
    {
        private const int Currency20 = 20;
        private readonly UusTicketServiceImp uusTicketService;
        public UusTicketServiceTests()
        {
            uusTicketService = new UusTicketServiceImp();
        }

        [Fact]
        public void IsValidCashOut_TicketIsNotCashOut_ReturnFalse()
        {
            // Arrange
            var ticket = new TicketEmailModel
            {
                IsCashOut = false
            };

            // Act
            var result = uusTicketService.IsValidCashOut(ticket);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsValidSettledSingleTicket_HasBetTypeIdIsParlayAndBetBuilder_ReturnFalse()
        {
            // Arrange
            var ticket = new TicketEmailModel
            {
                BetTypeId = 1,
                IsCashOut = true
            };

            var uusTicketService = new UusTicketServiceImp();

            // Act
            var result = uusTicketService.IsValidSettledSingleTicket(ticket);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void IsValidSettledSingleTicket_HasTicketIsNotSettled_ReturnFalse()
        {
            // Arrange
            var ticket = new TicketEmailModel
            {
                BetTypeId = 1,
                IsCashOut = false,
                Status = TicketStatus.Running
            };

            var uusTicketService = new UusTicketServiceImp();

            // Act
            var result = uusTicketService.IsValidSettledSingleTicket(ticket);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData(29)]
        [InlineData(38)]
        public void IsValidSettledSingleTicket_HasTicketIsCashOut_ReturnFalse(int betTypeId)
        {
            // Arrange
            var ticket = new TicketEmailModel
            {
                BetTypeId = betTypeId
            };

            var uusTicketService = new UusTicketServiceImp();

            // Act
            var result = uusTicketService.IsValidSettledSingleTicket(ticket);

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData(29)]
        [InlineData(38)]
        public void IsValidSettledParlayTicket_HasCheckMainParlayIsTrue_ReturnTrue(int betTypeId)
        {
            // Arrange
            var ticket = new TicketEmailModel
            {
                BetTypeId = betTypeId,
                Status = TicketStatus.Draw
            };

            var uusTicketService = new UusTicketServiceImp();

            // Act
            var result = uusTicketService.IsValidSettledParlayTicket(ticket, true);

            // Assert
            Assert.True(result);
        }

    }
}
