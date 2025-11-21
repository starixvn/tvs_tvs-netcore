using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.TechnicalError;

public class AddRequestAutoVoidProviderMistakeServiceTests
{
    private readonly CheckProviderMistakeTicketsService checkProviderMistakeTicketsService;
    private readonly MarkTicketsWhenAddEditService markTicketsWhenAddEditService;
    private readonly GetUpdateResultService getUpdateResultService;
    private readonly IDynamicRepository repository;
    private readonly AddRequestAutoVoidProviderMistakeServiceImp service;

    public AddRequestAutoVoidProviderMistakeServiceTests()
    {
        checkProviderMistakeTicketsService = Substitute.For<CheckProviderMistakeTicketsService>();
        markTicketsWhenAddEditService = Substitute.For<MarkTicketsWhenAddEditService>();
        getUpdateResultService = Substitute.For<GetUpdateResultService>();
        repository = Substitute.For<IDynamicRepository>();
        service = new AddRequestAutoVoidProviderMistakeServiceImp(
            checkProviderMistakeTicketsService,
            markTicketsWhenAddEditService,
            getUpdateResultService,
            repository);
    }

    #region ValidateTickets Tests

    [Fact]
    public async Task ValidateTickets_ValidData_ReturnSuccess()
    {
        // Arrange
        var transId = "123,456";
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                ValidTransIds = "123,456",
                InvalidTransIds = string.Empty,
                ExistingReqTransIds = string.Empty,
                UnsupportedTransIds = string.Empty,
                MatchId = 1
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                TransInfoJson = "{\"transIds\":[123,456]}"
            }
        };
        checkProviderMistakeTicketsService.ValidateTickets(transId).Returns(validationResult);

        // Act
        var (result, error) = await service.ValidateTickets(transId);

        // Assert
        Assert.NotNull(result);
        Assert.Null(error);
        Assert.Equal(validationResult, result);
        await checkProviderMistakeTicketsService.Received(1).ValidateTickets(transId);
    }

    [Fact]
    public async Task ValidateTickets_HasExistingReqTransIds_ReturnError()
    {
        // Arrange
        var transId = "123,456";
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                ExistingReqTransIds = "123",
                InvalidTransIds = string.Empty,
                UnsupportedTransIds = string.Empty
            },
            TransInfoAddRequest = new TransInfoAddRequestModel()
        };
        checkProviderMistakeTicketsService.ValidateTickets(transId).Returns(validationResult);

        // Act
        var (result, error) = await service.ValidateTickets(transId);

        // Assert
        Assert.Null(result);
        Assert.NotNull(error);
        Assert.Equal(1, error.ErrorCode);
        Assert.Contains("Existing in other request transaction IDs: 123", error.ErrorMsg);
    }

    [Fact]
    public async Task ValidateTickets_HasUnsupportedTransIds_ReturnError()
    {
        // Arrange
        var transId = "123,456";
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                UnsupportedTransIds = "456",
                InvalidTransIds = string.Empty,
                ExistingReqTransIds = string.Empty
            },
            TransInfoAddRequest = new TransInfoAddRequestModel()
        };
        checkProviderMistakeTicketsService.ValidateTickets(transId).Returns(validationResult);

        // Act
        var (result, error) = await service.ValidateTickets(transId);

        // Assert
        Assert.Null(result);
        Assert.NotNull(error);
        Assert.Equal(1, error.ErrorCode);
        Assert.Contains("Unsupported transaction IDs: 456", error.ErrorMsg);
    }

    [Fact]
    public async Task ValidateTickets_HasInvalidTransIds_ReturnError()
    {
        // Arrange
        var transId = "123,456";
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                InvalidTransIds = "789",
                ExistingReqTransIds = string.Empty,
                UnsupportedTransIds = string.Empty
            },
            TransInfoAddRequest = new TransInfoAddRequestModel()
        };
        checkProviderMistakeTicketsService.ValidateTickets(transId).Returns(validationResult);

        // Act
        var (result, error) = await service.ValidateTickets(transId);

        // Assert
        Assert.Null(result);
        Assert.NotNull(error);
        Assert.Equal(1, error.ErrorCode);
        Assert.Contains("Invalid transaction IDs: 789", error.ErrorMsg);
    }

    [Fact]
    public async Task ValidateTickets_EmptyTransInfoJson_ReturnError()
    {
        // Arrange
        var transId = "123,456";
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                ValidTransIds = "123,456",
                InvalidTransIds = string.Empty,
                ExistingReqTransIds = string.Empty,
                UnsupportedTransIds = string.Empty
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                TransInfoJson = string.Empty
            }
        };
        checkProviderMistakeTicketsService.ValidateTickets(transId).Returns(validationResult);

        // Act
        var (result, error) = await service.ValidateTickets(transId);

        // Assert
        Assert.Null(result);
        Assert.NotNull(error);
        Assert.Equal(1, error.ErrorCode);
        Assert.Equal("Failed to select tickets", error.ErrorMsg);
    }

    [Fact]
    public async Task ValidateTickets_NullTransInfoJson_ReturnError()
    {
        // Arrange
        var transId = "123,456";
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                ValidTransIds = "123,456",
                InvalidTransIds = string.Empty,
                ExistingReqTransIds = string.Empty,
                UnsupportedTransIds = string.Empty
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                TransInfoJson = null
            }
        };
        checkProviderMistakeTicketsService.ValidateTickets(transId).Returns(validationResult);

        // Act
        var (result, error) = await service.ValidateTickets(transId);

        // Assert
        Assert.Null(result);
        Assert.NotNull(error);
        Assert.Equal(1, error.ErrorCode);
        Assert.Equal("Failed to select tickets", error.ErrorMsg);
    }

    #endregion

    #region MarkTickets Tests

    [Fact]
    public async Task MarkTickets_Success_ReturnSuccessResult()
    {
        // Arrange
        var markTransIds = "123,456";
        var markTicketResult = new MarkTicketsResult
        {
            MarkedResults = new List<Result>(),
            MarkedTickets = new List<long> { 123, 456 }
        };
        markTicketsWhenAddEditService.Execute(
            IssueTypeConstant.TechnicalError,
            markTransIds,
            string.Empty).Returns(markTicketResult);
        getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService))
            .Returns((Result)null);

        // Act
        var result = await service.MarkTickets(markTransIds);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.ErrorCode);
        Assert.Equal(string.Empty, result.ErrorMsg);
        await markTicketsWhenAddEditService.Received(1).Execute(
            IssueTypeConstant.TechnicalError,
            markTransIds,
            string.Empty);
        getUpdateResultService.Received(1).GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService));
    }

    [Fact]
    public async Task MarkTickets_HasError_ReturnErrorResult()
    {
        // Arrange
        var markTransIds = "123,456";
        var markTicketResult = new MarkTicketsResult
        {
            MarkedResults = new List<Result>
            {
                new Result { ErrorCode = 1, ErrorMsg = "Mark ticket failed" }
            },
            MarkedTickets = new List<long>()
        };
        var expectedError = new Result { ErrorCode = 1, ErrorMsg = "Mark ticket failed" };
        markTicketsWhenAddEditService.Execute(
            IssueTypeConstant.TechnicalError,
            markTransIds,
            string.Empty).Returns(markTicketResult);
        getUpdateResultService.GetFirstError(markTicketResult.MarkedResults, nameof(MarkTicketsWhenAddEditService))
            .Returns(expectedError);

        // Act
        var result = await service.MarkTickets(markTransIds);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.ErrorCode);
        Assert.Equal("Mark ticket failed", result.ErrorMsg);
        AssertExtension.Equal(expectedError, result);
    }

    #endregion

    #region ExecuteAddRequest Tests

    [Fact]
    public async Task ExecuteAddRequest_Success_ReturnRequestId()
    {
        // Arrange
        var matchId = 1;
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                MatchId = matchId
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                TransInfoJson = "{\"transIds\":[123,456]}"
            }
        };
        var expectedRequestId = 100;
        repository.When(x => x.ExecuteAsync(Arg.Any<AddRequestCommand>()))
            .Do(x => ((AddRequestCommand)x[0]).RequestId = expectedRequestId);

        // Act
        var (requestId, result) = await service.ExecuteAddRequest(matchId, validationResult);

        // Assert
        Assert.Equal(expectedRequestId, requestId);
        Assert.NotNull(result);
        Assert.Equal(0, result.ErrorCode);
        Assert.Contains($"Successfully add void request: {expectedRequestId}", result.ErrorMsg);
        await repository.Received(1).ExecuteAsync(Arg.Any<AddRequestCommand>());
    }

    [Fact]
    public async Task ExecuteAddRequest_RequestIdIsZero_ReturnError()
    {
        // Arrange
        var matchId = 1;
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                MatchId = matchId
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                TransInfoJson = "{\"transIds\":[123,456]}"
            }
        };
        repository.When(x => x.ExecuteAsync(Arg.Any<AddRequestCommand>()))
            .Do(x => ((AddRequestCommand)x[0]).RequestId = 0);

        // Act
        var (requestId, result) = await service.ExecuteAddRequest(matchId, validationResult);

        // Assert
        Assert.Equal(0, requestId);
        Assert.NotNull(result);
        Assert.Equal(1, result.ErrorCode);
        Assert.Equal("Failed to add void request", result.ErrorMsg);
        await repository.Received(1).ExecuteAsync(Arg.Any<AddRequestCommand>());
    }

    [Fact]
    public async Task ExecuteAddRequest_RequestIdIsNegative_ReturnError()
    {
        // Arrange
        var matchId = 1;
        var validationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                MatchId = matchId
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                TransInfoJson = "{\"transIds\":[123,456]}"
            }
        };
        repository.When(x => x.ExecuteAsync(Arg.Any<AddRequestCommand>()))
            .Do(x => ((AddRequestCommand)x[0]).RequestId = -1);

        // Act
        var (requestId, result) = await service.ExecuteAddRequest(matchId, validationResult);

        // Assert
        Assert.Equal(0, requestId);
        Assert.NotNull(result);
        Assert.Equal(1, result.ErrorCode);
        Assert.Equal("Failed to add void request", result.ErrorMsg);
    }

    #endregion
}

