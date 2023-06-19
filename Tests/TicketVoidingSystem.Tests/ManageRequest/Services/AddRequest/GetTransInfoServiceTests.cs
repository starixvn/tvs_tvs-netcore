using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest
{
    public class GetTransInfoServiceTests
    {
        private readonly IDynamicRepository repository;
        private readonly GetTransInfoServiceImp service;

        public GetTransInfoServiceTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            service = new GetTransInfoServiceImp(repository);
        }

        // [Theory]
        // [InlineData(IssueTypeConstant.AbnormalBet)]
        // [InlineData(IssueTypeConstant.AbnormalBetRealMember)]
        // [InlineData(IssueTypeConstant.WrongKickOffTime)]
        // [InlineData(IssueTypeConstant.AbnormalAccount)]
        // [InlineData(IssueTypeConstant.EarlyKickOffTime)]
        // [InlineData(IssueTypeConstant.WrongScore)]
        // [InlineData(IssueTypeConstant.DangerAccepted)]
        // [InlineData(IssueTypeConstant.RedCard)]
        // [InlineData(IssueTypeConstant.WrongHDP)]
        // [InlineData(IssueTypeConstant.Wrong1stHDP)]
        // [InlineData(IssueTypeConstant.WrongOU)]
        // [InlineData(IssueTypeConstant.Wrong1stOU)]
        // [InlineData(IssueTypeConstant.ArchivedTicket)]
        // [InlineData(IssueTypeConstant.WrongOdds)]
        // [InlineData(null)]
        // [InlineData(99999)]
        // public async Task GetTransInfoJson_ReturnsListOfTransInfoJson(int issueTypeId)
        // {
        //     // Arrange
        //     var query = new GetTransInfoQuery
        //     {
        //         IssueTypeId = issueTypeId,
        //         Wrong1stOuModels = new List<WrongOuViewModel>(),
        //         WrongOuModels = new List<WrongOuViewModel>(),
        //         Wrong1stHdpModels = new List<WrongHdpViewModel>(),
        //         WrongHdpModels = new List<WrongHdpViewModel>(),
        //         RedCardModels = new List<DangerAcceptedViewModel>(),
        //         DangerAcceptedModels = new List<DangerAcceptedViewModel>(),
        //         WrongScoreModels = new List<WrongScoreInfoViewModel>(),
        //         WrongOddsModels = new List<WrongOddsViewModel>(),
        //         MatchId = 1,
        //         KickOffTime = DateTime.Now,
        //         Usernames = "a",
        //         ProductIds = "1",
        //         StatusIds = "1",
        //         TransIds = "1",
        //         FromDate = DateTime.Now,
        //         ToDate = DateTime.Now
        //     };
        //     repository.GetAsync<string>(Arg.Any<GetTicketSiteDbCriteria>()).ReturnsForAnyArgs("ss");

        //     // Act
        //     var result = await service.GetTransInfoJson(query);

        //     // Assert
        //     Assert.NotNull(result);
        //     await repository.Received().GetAsync<string>(Arg.Any<GetTicketSiteDbCriteria>());
        // }

        // [Fact]
        // public async Task GetTransInfoJsonForVoid_ValidData_ReturnTransInfo()
        // {
        //     // Arrange
        //     var singleTickets = new List<BetId> { new BetId() };
        //     var parlayTickets = new List<BetId> { new BetId() };
        //     var cancelCashOutTickets = new List<BetId> { new BetId() };
        //     repository.GetAsync<string>(Arg.Compat.Any<GetTransInfoForVoidCriteria>()).ReturnsForAnyArgs("");

        //     // Act
        //     var actual = await service.GetTransInfoJsonForVoid(singleTickets, parlayTickets, cancelCashOutTickets, null);

        //     // Assert
        //     Assert.NotNull(actual);
        //     await repository.Received().GetAsync<string>(Arg.Compat.Any<GetTransInfoForVoidCriteria>());
        // }

        // [Fact]
        // public async Task GetTransInfoJsonForVoid14_ValidData_ReturnTransInfo()
        // {
        //     // Arrange
        //     var singleTickets = new List<BetId> { new BetId() };
        //     repository.GetAsync<string>(Arg.Compat.Any<GetTransInfoForVoid14Criteria>()).ReturnsForAnyArgs("");

        //     // Act
        //     var actual = await service.GetTransInfoJsonForVoid14(singleTickets);

        //     // Assert
        //     Assert.NotNull(actual);
        //     await repository.Received().GetAsync<string>(Arg.Compat.Any<GetTransInfoForVoid14Criteria>());
        // }
    }
}