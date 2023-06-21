using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest
{
    public class GetRequestServiceTests
    {
        private readonly RemotingRefWrapperService remotingRefService;
        private readonly IDynamicRepository repository;
        private readonly GetRequestServiceImp service;

        public GetRequestServiceTests()
        {
            remotingRefService = Substitute.For<RemotingRefWrapperService>();
            repository = Substitute.For<IDynamicRepository>();
            service = new GetRequestServiceImp(repository, remotingRefService);
        }

        [Fact]
        public async Task GetRequest_IsWrongScore_ReturnExpectedViewModel()
        {
            // Arrange
            var request = new GetRequestRequest { RequestId = 1 };
            var fakeData = new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                    new List<RequestDetailModel> { new RequestDetailModel { IssueTypeId = IssueTypeConstant.WrongScore, SportType = 0,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>" } },
                    new List<RequestEventModel> { new RequestEventModel { MatchId = 12345 } },
                    new List<Message> { new Message() }
                );
            var expectedResult = new RequestDetailViewModel
            {
                Request = new RequestDetailModel
                {
                    IssueTypeId = IssueTypeConstant.WrongScore,
                    SportType = 0,
                    OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                },
                Event = null,
                Messages = new List<Message> { new Message() },
                WrongScoreModels = new List<WrongScoreInfoViewModel>()
            };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request).ReturnsForAnyArgs(fakeData);

            // Act
            var actualResult = await service.GetRequest(request);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
            Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
            Assert.Null(actualResult.Event);
            Assert.Equal(expectedResult.Messages.Count(), actualResult.Messages.Count());
        }

        [Fact]
        public async Task GetRequest_IsAbnormalbet_ReturnExpectedViewModel()
        {
            // Arrange
            var request = new GetRequestRequest { RequestId = 1 };
            var fakeData = new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                    new List<RequestDetailModel> { new RequestDetailModel { IssueTypeId = IssueTypeConstant.AbnormalBet, SportType = 0,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>" } },
                    new List<RequestEventModel> { new RequestEventModel { MatchId = 12345 } },
                    new List<Message> { new Message() }
                );
            var expectedResult = new RequestDetailViewModel
            {
                Request = new RequestDetailModel
                {
                    IssueTypeId = IssueTypeConstant.AbnormalBet,
                    SportType = 0,
                    OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                },
                Event = new RequestEventModel { MatchId = 12345 },
                Messages = new List<Message> { new Message() },
                WrongScoreModels = null
            };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request).ReturnsForAnyArgs(fakeData);

            // Act
            var actualResult = await service.GetRequest(request);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
            Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
            Assert.Null(actualResult.WrongScoreModels);
            Assert.Equal(expectedResult.Messages.Count(), actualResult.Messages.Count());
        }

        [Fact]
        public async Task GetRequest_IsDangerAccepted_ReturnExpectedViewModel()
        {
            // Arrange
            var request = new GetRequestRequest { RequestId = 1 };
            var fakeData = new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                    new List<RequestDetailModel> { new RequestDetailModel { IssueTypeId = IssueTypeConstant.DangerAccepted, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>" } },
                    new List<RequestEventModel> { new RequestEventModel { MatchId = 12345 } },
                    new List<Message> { new Message() }
                );
            var expectedResult = new RequestDetailViewModel
            {
                Request = new RequestDetailModel
                {
                    IssueTypeId = IssueTypeConstant.DangerAccepted,
                    SportType = 1,
                    OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                },
                Event = null,
                Messages = new List<Message> { new Message() },
                DangerAcceptedModels = new List<DangerAcceptedViewModel>()
            };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request).ReturnsForAnyArgs(fakeData);

            // Act
            var actualResult = await service.GetRequest(request);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
            Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
            Assert.Null(actualResult.Event);
            Assert.Equal(expectedResult.Messages.Count(), actualResult.Messages.Count());
        }

        [Fact]
        public async Task GetRequest_IsRedCard_ReturnExpectedViewModel()
        {
            // Arrange
            var request = new GetRequestRequest { RequestId = 1 };
            var fakeData = new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                    new List<RequestDetailModel> { new RequestDetailModel { IssueTypeId = IssueTypeConstant.RedCard, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>" } },
                    new List<RequestEventModel> { new RequestEventModel { MatchId = 12345 } },
                    new List<Message> { new Message() }
                );
            var expectedResult = new RequestDetailViewModel
            {
                Request = new RequestDetailModel
                {
                    IssueTypeId = IssueTypeConstant.RedCard,
                    SportType = 1,
                    OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                },
                Event = null,
                Messages = new List<Message> { new Message() },
                RedCardModels = new List<DangerAcceptedViewModel>()
            };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request).ReturnsForAnyArgs(fakeData);

            // Act
            var actualResult = await service.GetRequest(request);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
            Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
            Assert.Null(actualResult.Event);
            Assert.Equal(expectedResult.Messages.Count(), actualResult.Messages.Count());
        }

        [Fact]
        public async Task GetRequest_IsWrongHDP_ReturnExpectedViewModel()
        {
            // Arrange
            var request = new GetRequestRequest { RequestId = 1 };
            var fakeData = new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                    new List<RequestDetailModel> { new RequestDetailModel { IssueTypeId = IssueTypeConstant.WrongHDP, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>" } },
                    new List<RequestEventModel> { new RequestEventModel { MatchId = 12345 } },
                    new List<Message> { new Message() }
                );
            var expectedResult = new RequestDetailViewModel
            {
                Request = new RequestDetailModel
                {
                    IssueTypeId = IssueTypeConstant.WrongHDP,
                    SportType = 1,
                    OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                },
                Event = null,
                Messages = new List<Message> { new Message() },
                WrongHdpModels = new List<WrongHdpViewModel>()
            };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request).ReturnsForAnyArgs(fakeData);

            // Act
            var actualResult = await service.GetRequest(request);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
            Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
            Assert.Null(actualResult.Event);
            Assert.Equal(expectedResult.Messages.Count(), actualResult.Messages.Count());
        }

        [Fact]
        public async Task GetRequest_IsWrong1stHDP_ReturnExpectedViewModel()
        {
            // Arrange
            var request = new GetRequestRequest { RequestId = 1 };
            var fakeData = new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                    new List<RequestDetailModel> { new RequestDetailModel { IssueTypeId = IssueTypeConstant.Wrong1stHDP, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>" } },
                    new List<RequestEventModel> { new RequestEventModel { MatchId = 12345 } },
                    new List<Message> { new Message() }
                );
            var expectedResult = new RequestDetailViewModel
            {
                Request = new RequestDetailModel
                {
                    IssueTypeId = IssueTypeConstant.Wrong1stHDP,
                    SportType = 1,
                    OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                },
                Event = null,
                Messages = new List<Message> { new Message() },
                WrongHdpModels = new List<WrongHdpViewModel>()
            };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request).ReturnsForAnyArgs(fakeData);

            // Act
            var actualResult = await service.GetRequest(request);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
            Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
            Assert.Null(actualResult.Event);
            Assert.Equal(expectedResult.Messages.Count(), actualResult.Messages.Count());
        }

        [Fact]
        public async Task GetRequest_IsWrongOU_ReturnExpectedViewModel()
        {
            // Arrange
            var request = new GetRequestRequest { RequestId = 1 };
            var fakeData = new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                    new List<RequestDetailModel> { new RequestDetailModel { IssueTypeId = IssueTypeConstant.WrongOU, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>" } },
                    new List<RequestEventModel> { new RequestEventModel { MatchId = 12345 } },
                    new List<Message> { new Message() }
                );
            var expectedResult = new RequestDetailViewModel
            {
                Request = new RequestDetailModel
                {
                    IssueTypeId = IssueTypeConstant.WrongOU,
                    SportType = 1,
                    OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                },
                Event = null,
                Messages = new List<Message> { new Message() },
                WrongOuModels = new List<WrongOuViewModel>()
            };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request).ReturnsForAnyArgs(fakeData);

            // Act
            var actualResult = await service.GetRequest(request);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
            Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
            Assert.Null(actualResult.Event);
            Assert.Equal(expectedResult.Messages.Count(), actualResult.Messages.Count());
        }

        [Fact]
        public async Task GetRequest_IsWrong1stOU_ReturnExpectedViewModel()
        {
            // Arrange
            var request = new GetRequestRequest { RequestId = 1 };
            var fakeData = new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                    new List<RequestDetailModel> { new RequestDetailModel { IssueTypeId = IssueTypeConstant.Wrong1stOU, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>" } },
                    new List<RequestEventModel> { new RequestEventModel { MatchId = 12345 } },
                    new List<Message> { new Message() }
                );
            var expectedResult = new RequestDetailViewModel
            {
                Request = new RequestDetailModel
                {
                    IssueTypeId = IssueTypeConstant.Wrong1stOU,
                    SportType = 1,
                    OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                },
                Event = null,
                Messages = new List<Message> { new Message() },
                WrongOuModels = new List<WrongOuViewModel>()
            };
            repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request).ReturnsForAnyArgs(fakeData);

            // Act
            var actualResult = await service.GetRequest(request);

            // Assert
            await repository.Received(1).FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
            Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
            Assert.Null(actualResult.Event);
            Assert.Equal(expectedResult.Messages.Count(), actualResult.Messages.Count());

        }
    }
}