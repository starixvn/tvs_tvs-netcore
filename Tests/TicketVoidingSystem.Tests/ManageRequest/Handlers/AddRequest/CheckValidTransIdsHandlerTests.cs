using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class CheckValidTransIdsHandlerTests
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly CheckValidTransIdsHandler handler;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly IDynamicRepository repository;

    public CheckValidTransIdsHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        matchInfoAddRequestService = Substitute.For<MatchInfoAddRequestService>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        handler = new CheckValidTransIdsHandler(repository, matchInfoAddRequestService, getTransInfoService);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckValidTransIdsRequest();
        var result = new IEnumerable<object>[4];
        var validation = new ValidationAbnormalBet();
        var transInfoAddRequestModel = new TransInfoAddRequestModel
        { RemoveTransIds = "123", UnMarkTransIds = "123", MarkTransIds = "456" };
        result[0] = new[] { new MatchInfoAddRequest() };
        result[1] = new[] { validation };
        result[2] = new[] { transInfoAddRequestModel };
        result[3] = new[] { "123" };
        var match = new MatchInfoAddRequest();
        var mappingTypes = new[]
        {
            typeof(MatchInfoAddRequest), typeof(ValidationAbnormalBet), typeof(TransInfoAddRequestModel), typeof(string)
        };
        matchInfoAddRequestService.UpdateDataFromRemotingRef(Arg.Any<MatchInfoAddRequest>())
            .ReturnsForAnyArgs(match);
        repository.FetchMultipleAsync(Arg.Any<CheckValidTransIdsCriteria>(), mappingTypes, CancellationToken.None)
            .ReturnsForAnyArgs(result);
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>())
            .ReturnsForAnyArgs(new List<string> { "123", "" });
        var viewModel = new CheckValidTransIdsViewModel
        {
            Match = matchInfoAddRequestService.UpdateDataFromRemotingRef(match),
            Validation = validation,
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = "123",
                UnMarkTransIds = "123",
                MarkTransIds = "456",
                TransInfoJson = "123"
            }
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }

    [Fact]
    public async Task Handler_NoHasTransInfoAddRequestModel_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckValidTransIdsRequest();
        var result = new IEnumerable<object>[4];
        var validation = new ValidationAbnormalBet();
        result[0] = new[] { new MatchInfoAddRequest() };
        result[1] = new[] { validation };
        result[2] = Array.Empty<object>();
        result[3] = new[] { "123" };
        var match = new MatchInfoAddRequest();
        var mappingTypes = new[]
        {
            typeof(MatchInfoAddRequest), typeof(ValidationAbnormalBet), typeof(TransInfoAddRequestModel), typeof(string)
        };
        matchInfoAddRequestService.UpdateDataFromRemotingRef(Arg.Any<MatchInfoAddRequest>())
            .ReturnsForAnyArgs(match);
        repository.FetchMultipleAsync(Arg.Any<CheckValidTransIdsCriteria>(), mappingTypes, CancellationToken.None)
            .ReturnsForAnyArgs(result);
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>())
            .ReturnsForAnyArgs(new List<string> { "123", "" });
        var viewModel = new CheckValidTransIdsViewModel
        {
            Match = matchInfoAddRequestService.UpdateDataFromRemotingRef(match),
            Validation = validation,
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = null,
                UnMarkTransIds = null,
                MarkTransIds = null,
                TransInfoJson = "123"
            }
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }
}