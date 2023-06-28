using Xunit;
using NSubstitute;
using TicketVoidingSystem.Constants;
using Fanex.LetstalkService.Client;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;
using Fanex.LetstalkService.Core.Models;
using System.Threading.Tasks;
using TicketVoidingSystem.Services.Letstalk.GroupTicketListing;
using TicketVoidingSystem.Services.Letstalk.GroupVoidSettledBet;
using TicketVoidingSystem.ManageVoidServices.Services;
using System.Collections.Generic;
using TicketVoidingSystem.Models.Letstalk;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.Letstalk
{
    public class NotificationLetstalkServiceTests: AppSettingFixture
    {
        private readonly GroupVoidSettledBetService groupVoidSettledBetService;
        private readonly GroupTicketListingService groupTicketListingService;
        private NotificationLetstalkServiceImp service;

        public NotificationLetstalkServiceTests()
        {
            groupVoidSettledBetService = Substitute.For<GroupVoidSettledBetService>();
            groupTicketListingService = Substitute.For<GroupTicketListingService>();
            service = new NotificationLetstalkServiceImp(groupVoidSettledBetService, groupTicketListingService);
        }

        [Fact]
        public async Task SendToGroupVoidSettledBets_ValidRequest_AlwayCalledSendMessageWithTicketInfo()
        {
            // Arrange
            var ticketInfo = new TicketInfoForLetstalk();
            var tickets = new List<TicketEmailModel>();
            
            groupVoidSettledBetService.SendMessageWithTicketInfo(Arg.Any<LetstalkModel>(), Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>())
                .Returns(new List<Models.Result> ());

            // Act
            var result = await service.SendToGroupVoidSettledBets(ticketInfo, tickets);

            // Assert
            Assert.Equal(new List<Models.Result>(), result);
            await groupVoidSettledBetService.Received(1).SendMessageWithTicketInfo(Arg.Any<LetstalkModel>(), Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>());
        }

    }
}
