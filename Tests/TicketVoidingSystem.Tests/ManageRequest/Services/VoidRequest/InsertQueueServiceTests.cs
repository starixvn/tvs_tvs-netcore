using Fanex.Data.Repository;
using NSubstitute;
using System.Collections.Generic;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest
{
    public class InsertQueueServiceTests
    {
        private readonly IDynamicRepository repository;
        private readonly SessionService sessionService;
        private readonly InsertVoidingHistoryService insertVoidingHistoryService;
        private readonly InsertQueueServiceImp service;

        public InsertQueueServiceTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            sessionService = Substitute.For<SessionService>();
            insertVoidingHistoryService = Substitute.For<InsertVoidingHistoryService>();
            service = new InsertQueueServiceImp(repository, sessionService, insertVoidingHistoryService);
        }

        [Theory]
        [InlineData(IssueTypeConstant.DangerAccepted)]
        [InlineData(IssueTypeConstant.RedCard)]
        [InlineData(IssueTypeConstant.WrongScore)]
        [InlineData(IssueTypeConstant.AbnormalAccount)]
        [InlineData(0)]
        public async Task InsertTicketVoidingQueue_ValidRequest_HasCreateInsertTicketVoidingQueueCriteria(int issueTypeId)
        {
            // Arrange
            var betId1 = new BetId { TransId = "123", SiteDbGroupId = 1 };
            var betId2 = new BetId { TransId = "123", SiteDbGroupId = 2 };

            var query = new InsertQueueQuery
            {
                SingleTickets = new List<BetId> { betId1, betId2 },
                ParlayTickets = new List<BetId> { betId1, betId1 },
                CancelCashOutTickets = new List<BetId> { betId1, betId2, betId2 },
                CricketTickets = new List<BetId> { betId1 },
                IssueTypeId = issueTypeId
            };

            var mappingTypes = new[] {
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel),
            typeof(RequestDetailTicketModel)
        };
            var requestDetailTicketModel = new RequestDetailTicketModel { TransId = 123, SiteDbGroupId = 1, RequestId = 1 };
            var validVoidSingleTickets = new List<RequestDetailTicketModel> { requestDetailTicketModel };
            var validVoidParlayTickets = new List<RequestDetailTicketModel> { requestDetailTicketModel, requestDetailTicketModel };
            var validVoidCricketTickets = new List<RequestDetailTicketModel> { requestDetailTicketModel, requestDetailTicketModel, requestDetailTicketModel };
            var validCancelCOTickets = new List<RequestDetailTicketModel> { requestDetailTicketModel };
            var validVoidSingleTickets14 = new List<RequestDetailTicketModel> { requestDetailTicketModel, requestDetailTicketModel };

            IEnumerable<object>[] expectedTicketTypeModel = {validVoidSingleTickets, validVoidSingleTickets, validVoidParlayTickets, validVoidParlayTickets,
                validVoidCricketTickets,validVoidCricketTickets, validCancelCOTickets, validVoidSingleTickets14 };

            insertVoidingHistoryService.InsertVoidingHistory(Arg.Any<InsertQueueQuery>(), default, Arg.Any<string>()).ReturnsForAnyArgs(1);
            repository.FetchMultipleAsync(Arg.Any<CheckTicketsAllowToVoidCriteria>(), mappingTypes).ReturnsForAnyArgs(expectedTicketTypeModel);
            sessionService.GetClientIp().ReturnsForAnyArgs("123");
            repository.ExecuteAsync(Arg.Any<InsertTicketVoidingQueueCriteria>()).Returns(1);
            repository.ExecuteAsync(Arg.Any<UpdateIsProcessedForRequestTicketsCriteria>()).Returns(1);

            // Act
            await service.InsertTicketVoidingQueue(query);

            // Assert
            await repository.Received().ExecuteAsync(Arg.Any<InsertTicketVoidingQueueCriteria>());
        }

        [Fact]
        public async Task UpdateIsProcessed_HasCreateUpdateIsProcessedForRequestTicketsCriteria()
        {
            // Arrange
            var betId1 = new BetId { TransId = "123", SiteDbGroupId = 1 };
            var betId2 = new BetId { TransId = "123", SiteDbGroupId = 2 };

            var query = new InsertQueueQuery
            {
                SingleTickets = new List<BetId> { betId1, betId2 },
                ParlayTickets = new List<BetId> { betId1, betId1 },
                CancelCashOutTickets = new List<BetId> { betId1, betId2, betId2 },
                CricketTickets = new List<BetId> { betId1 },
                IssueTypeId = 1,
                RequestId = 123
            };
       
            repository.ExecuteAsync(Arg.Any<UpdateIsProcessedForRequestTicketsCriteria>()).Returns(1);

            // Act
            await service.UpdateIsProcessed(query);

            // Assert
            await repository.Received().ExecuteAsync(Arg.Any<UpdateIsProcessedForRequestTicketsCriteria>());
        }
    }
}
