using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetOperatorsHandlerTests
{
    private readonly GetOperatorsHandler handler;
    private readonly IDynamicRepository repository;

    public GetOperatorsHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        handler = new GetOperatorsHandler(repository);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new GetOperatorsRequest
        {
            MatchIds = "1"
        };
        var data = new List<OperatorInfoModel>
        {
            new() { MatchId = 1, TraderID = 1, TraderName = "1", SuspenderID = 2, SuspenderName = "2" },
            new()
        };
        repository.FetchAsync<OperatorInfoModel>(Arg.Any<GetOperatorsRequest>(), CancellationToken.None)
            .ReturnsForAnyArgs(data);
        var viewModel = new List<OperatorInfo>
        {
            new()
            {
                MatchId = 1,
                OperatorId = 1,
                OperatorType = OperatorConstant.TraderType,
                UserName = "1"
            },
            new()
            {
                MatchId = 1,
                OperatorId = 2,
                OperatorType = OperatorConstant.SuspenderType,
                UserName = "2"
            }
        };
        viewModel.Insert(0, OperatorConstant.SuspenderNA);
        viewModel.Insert(0, OperatorConstant.TraderNA);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }

    [Fact]
    public async Task Handler_NoHasOperatorInfoModel_ReturnModelExpected()
    {
        // Arrange
        var request = new GetOperatorsRequest
        {
            MatchIds = "1"
        };
        var data = new List<OperatorInfoModel>();
        repository.FetchAsync<OperatorInfoModel>(Arg.Any<GetOperatorsRequest>(), CancellationToken.None)
            .ReturnsForAnyArgs(data);
        var viewModel = new List<OperatorInfo>();
        viewModel.Insert(0, OperatorConstant.SuspenderNA);
        viewModel.Insert(0, OperatorConstant.TraderNA);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }
}