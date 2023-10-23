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

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest;

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
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.WrongScore, SportType = 0,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
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
            Messages = new List<Message> { new() },
            WrongScoreModels = new List<WrongScoreInfoViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Fact]
    public async Task GetRequest_IsAbnormalBet_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.AbnormalBet, SportType = 0,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
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
            Messages = new List<Message> { new() },
            WrongScoreModels = null
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.WrongScoreModels);
    }

    [Fact]
    public async Task GetRequest_IsDangerAccepted_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.DangerAccepted, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
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
            Messages = new List<Message> { new() },
            DangerAcceptedModels = new List<DangerAcceptedViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);
        remotingRefService.GetTeamName(Arg.Any<string>(), LanguageCode.English).ReturnsForAnyArgs("TeamName");
        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Fact]
    public async Task GetRequest_IsRedCard_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.RedCard, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345, AwayId = 1, HomeId = 1 } },
                new List<Message> { new() }
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
            Messages = new List<Message> { new() },
            RedCardModels = new List<DangerAcceptedViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Fact]
    public async Task GetRequest_IsWrongHDP_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.WrongHDP, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
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
            Messages = new List<Message> { new() },
            WrongHdpModels = new List<WrongHdpViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Fact]
    public async Task GetRequest_IsWrong1stHDP_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.Wrong1stHDP, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
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
            Messages = new List<Message> { new() },
            WrongHdpModels = new List<WrongHdpViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Fact]
    public async Task GetRequest_IsWrongOU_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.WrongOU, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
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
            Messages = new List<Message> { new() },
            WrongOuModels = new List<WrongOuViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Fact]
    public async Task GetRequest_IsWrong1stOU_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.Wrong1stOU, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
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
            Messages = new List<Message> { new() },
            WrongOuModels = new List<WrongOuViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Fact]
    public async Task GetRequest_IsWrongOdds_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.WrongOdds, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
            );
        var expectedResult = new RequestDetailViewModel
        {
            Request = new RequestDetailModel
            {
                IssueTypeId = IssueTypeConstant.WrongOdds,
                SportType = 1,
                OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
            },
            Event = null,
            Messages = new List<Message> { new() },
            WrongOuModels = new List<WrongOuViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Fact]
    public async Task GetRequest_IsReducedOver_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.ReducedOver, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
            );
        var expectedResult = new RequestDetailViewModel
        {
            Request = new RequestDetailModel
            {
                IssueTypeId = IssueTypeConstant.ReducedOver,
                SportType = 1,
                OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
            },
            Event = null,
            Messages = new List<Message> { new() },
            WrongOuModels = new List<WrongOuViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Theory]
    [InlineData(true, "12345 - TeamName (N) - vs - TeamName")]
    [InlineData(false, "12345 - TeamName - vs - TeamName")]
    public async Task GetMatchName_HasRequestEventModelValid_ReturnStringName(bool isNeutral, string expected)
    {
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.DangerAccepted, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345, IsNeutral = isNeutral } },
                new List<Message> { new() }
            );
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);
        remotingRefService.GetTeamName(Arg.Any<string>(), LanguageCode.English).ReturnsForAnyArgs("TeamName");

        // Act
        var actualResult = await service.GetRequest(request);
        var dangerAcceptedModel = actualResult.DangerAcceptedModels.ToList()[0];

        // Assert

        Assert.Equal(expected, dangerAcceptedModel.Name);
    }

    [Fact]
    public async Task GetRequest_DuplicateTickets_ReturnExpectedViewModel()
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = IssueTypeConstant.DuplicateTickets, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
            );
        var expectedResult = new RequestDetailViewModel
        {
            Request = new RequestDetailModel
            {
                IssueTypeId = IssueTypeConstant.DuplicateTickets,
                SportType = 1,
                OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
            },
            Event = null,
            Messages = new List<Message> { new() },
            DuplicateTicketsModel = new DuplicateTicketsViewModel()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }

    [Theory]
    [InlineData(IssueTypeConstant.EarlyKickOffTime)]
    [InlineData(IssueTypeConstant.WrongKickOffTime)]
    [InlineData(IssueTypeConstant.NotParticipate)]
    public async Task GetRequest_ReturnExpectedViewModel(int issueTypeId)
    {
        // Arrange
        var request = new GetRequestRequest { RequestId = 1 };
        var fakeData =
            new ValueTuple<IEnumerable<RequestDetailModel>, IEnumerable<RequestEventModel>, IEnumerable<Message>>(
                new List<RequestDetailModel>
                {
                    new()
                    {
                        IssueTypeId = issueTypeId, SportType = 1,
                        OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
                    }
                },
                new List<RequestEventModel> { new() { MatchId = 12345 } },
                new List<Message> { new() }
            );
        var expectedResult = new RequestDetailViewModel
        {
            Request = new RequestDetailModel
            {
                IssueTypeId = issueTypeId,
                SportType = 1,
                OperatorInfo = "<root><r OperatorId='1' TypeId='8'/><r OperatorId='1' TypeId='8'/></root>"
            },
            Event = null,
            Messages = new List<Message> { new() },
            WrongHdpModels = new List<WrongHdpViewModel>()
        };
        repository.FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(request)
            .ReturnsForAnyArgs(fakeData);

        // Act
        var actualResult = await service.GetRequest(request);

        // Assert
        await repository.Received(1)
            .FetchMultipleAsync<RequestDetailModel, RequestEventModel, Message>(
                Arg.Compat.Is<GetRequestRequest>(x => x.RequestId == 1));
        Assert.Equal(expectedResult.Request.IssueTypeId, actualResult.Request.IssueTypeId);
        Assert.Null(actualResult.Event);
    }
}