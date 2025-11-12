using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.TechnicalError;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class AutoVoidTechnicalErrorHandlerTests
{
    private readonly AddRequestAutoVoidProviderMistakeService addRequestAutoVoidProviderMistakeService;
    private readonly InsertAutoVoidRequestQueueService insertAutoVoidRequestQueueService;
    private readonly OperatorKeyEncryptionService operatorKeyEncryptionService;
    private readonly AutoVoidTechnicalErrorHandler handler;

    public AutoVoidTechnicalErrorHandlerTests()
    {
        addRequestAutoVoidProviderMistakeService = Substitute.For<AddRequestAutoVoidProviderMistakeService>();
        insertAutoVoidRequestQueueService = Substitute.For<InsertAutoVoidRequestQueueService>();
        operatorKeyEncryptionService = Substitute.For<OperatorKeyEncryptionService>();
        handler = new AutoVoidTechnicalErrorHandler(
            addRequestAutoVoidProviderMistakeService,
            insertAutoVoidRequestQueueService,
            operatorKeyEncryptionService);
    }

    [Fact]
    public async Task Handle_Successful_AllStepsPassed()
    {
        // Arrange
        var request = new AddTechnicalErrorAutoVoidRequest
        {
            TransId = 123,
            OperatorKey = "valid-operator-key"
        };

        var validOperatorResult = new Result { ErrorCode = 0 };
        operatorKeyEncryptionService.ValidateOperatorKey(request.OperatorKey).Returns(validOperatorResult);

        var ticketValidationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                MatchId = 456,
                ValidTransIds = "123",
                InvalidTransIds = string.Empty,
                ExistingReqTransIds = string.Empty,
                UnsupportedTransIds = string.Empty
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                MarkTransIds = "123",
                TransInfoJson = "{\"transIds\":[123]}"
            }
        };
        addRequestAutoVoidProviderMistakeService.ValidateTickets(request.TransId.ToString())
            .Returns((ticketValidationResult, (Result)null));

        var markTicketResult = new Result { ErrorCode = 0 };
        addRequestAutoVoidProviderMistakeService.MarkTickets(ticketValidationResult.TransInfoAddRequest.MarkTransIds)
            .Returns(markTicketResult);

        var requestId = 789;
        var addRequestResult = new Result { ErrorCode = 0, ErrorMsg = $"Successfully add void request: {requestId}" };
        addRequestAutoVoidProviderMistakeService.ExecuteAddRequest(
            ticketValidationResult.Validation.MatchId,
            ticketValidationResult)
            .Returns((requestId, addRequestResult));

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.ErrorCode);
        Assert.Contains($"Successfully add void request: {requestId}", result.ErrorMsg);

        operatorKeyEncryptionService.Received(1).ValidateOperatorKey(request.OperatorKey);
        await addRequestAutoVoidProviderMistakeService.Received(1).ValidateTickets(request.TransId.ToString());
        await addRequestAutoVoidProviderMistakeService.Received(1).MarkTickets(ticketValidationResult.TransInfoAddRequest.MarkTransIds);
        await addRequestAutoVoidProviderMistakeService.Received(1).ExecuteAddRequest(
            ticketValidationResult.Validation.MatchId,
            ticketValidationResult);
        await insertAutoVoidRequestQueueService.Received(1).Execute(
            requestId,
            VoidActionTypeConstant.AutoVoidInstantId,
            Arg.Is<IEnumerable<int>>(x => x.Count() == 1 && x.First() == ticketValidationResult.Validation.MatchId));
    }

    [Fact]
    public async Task Handle_InvalidOperatorKey_ReturnError()
    {
        // Arrange
        var request = new AddTechnicalErrorAutoVoidRequest
        {
            TransId = 123,
            OperatorKey = "invalid-operator-key"
        };

        var invalidOperatorResult = new Result { ErrorCode = 403, ErrorMsg = "Invalid operator key." };
        operatorKeyEncryptionService.ValidateOperatorKey(request.OperatorKey).Returns(invalidOperatorResult);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(403, result.ErrorCode);
        Assert.Equal("Invalid operator key.", result.ErrorMsg);

        operatorKeyEncryptionService.Received(1).ValidateOperatorKey(request.OperatorKey);
        await addRequestAutoVoidProviderMistakeService.DidNotReceive().ValidateTickets(Arg.Any<string>());
        await addRequestAutoVoidProviderMistakeService.DidNotReceive().MarkTickets(Arg.Any<string>());
        await addRequestAutoVoidProviderMistakeService.DidNotReceive().ExecuteAddRequest(Arg.Any<int>(), Arg.Any<CheckProviderMistakeTicketsResultModel>());
        await insertAutoVoidRequestQueueService.DidNotReceive().Execute(Arg.Any<int>(), Arg.Any<int?>(), Arg.Any<int[]>());
    }

    [Fact]
    public async Task Handle_ValidateTicketsError_ReturnError()
    {
        // Arrange
        var request = new AddTechnicalErrorAutoVoidRequest
        {
            TransId = 123,
            OperatorKey = "valid-operator-key"
        };

        var validOperatorResult = new Result { ErrorCode = 0 };
        operatorKeyEncryptionService.ValidateOperatorKey(request.OperatorKey).Returns(validOperatorResult);

        var errorResult = new Result { ErrorCode = 1, ErrorMsg = "Invalid transaction IDs: 123" };
        addRequestAutoVoidProviderMistakeService.ValidateTickets(request.TransId.ToString())
            .Returns(((CheckProviderMistakeTicketsResultModel)null, errorResult));

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.ErrorCode);
        Assert.Equal("Invalid transaction IDs: 123", result.ErrorMsg);

        operatorKeyEncryptionService.Received(1).ValidateOperatorKey(request.OperatorKey);
        await addRequestAutoVoidProviderMistakeService.Received(1).ValidateTickets(request.TransId.ToString());
        await addRequestAutoVoidProviderMistakeService.DidNotReceive().MarkTickets(Arg.Any<string>());
        await addRequestAutoVoidProviderMistakeService.DidNotReceive().ExecuteAddRequest(Arg.Any<int>(), Arg.Any<CheckProviderMistakeTicketsResultModel>());
        await insertAutoVoidRequestQueueService.DidNotReceive().Execute(Arg.Any<int>(), Arg.Any<int?>(), Arg.Any<int[]>());
    }

    [Fact]
    public async Task Handle_MarkTicketsError_ReturnError()
    {
        // Arrange
        var request = new AddTechnicalErrorAutoVoidRequest
        {
            TransId = 123,
            OperatorKey = "valid-operator-key"
        };

        var validOperatorResult = new Result { ErrorCode = 0 };
        operatorKeyEncryptionService.ValidateOperatorKey(request.OperatorKey).Returns(validOperatorResult);

        var ticketValidationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                MatchId = 456,
                ValidTransIds = "123",
                InvalidTransIds = string.Empty,
                ExistingReqTransIds = string.Empty,
                UnsupportedTransIds = string.Empty
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                MarkTransIds = "123",
                TransInfoJson = "{\"transIds\":[123]}"
            }
        };
        addRequestAutoVoidProviderMistakeService.ValidateTickets(request.TransId.ToString())
            .Returns((ticketValidationResult, (Result)null));

        var markTicketError = new Result { ErrorCode = 1, ErrorMsg = "Mark ticket failed" };
        addRequestAutoVoidProviderMistakeService.MarkTickets(ticketValidationResult.TransInfoAddRequest.MarkTransIds)
            .Returns(markTicketError);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.ErrorCode);
        Assert.Equal("Mark ticket failed", result.ErrorMsg);

        operatorKeyEncryptionService.Received(1).ValidateOperatorKey(request.OperatorKey);
        await addRequestAutoVoidProviderMistakeService.Received(1).ValidateTickets(request.TransId.ToString());
        await addRequestAutoVoidProviderMistakeService.Received(1).MarkTickets(ticketValidationResult.TransInfoAddRequest.MarkTransIds);
        await addRequestAutoVoidProviderMistakeService.DidNotReceive().ExecuteAddRequest(Arg.Any<int>(), Arg.Any<CheckProviderMistakeTicketsResultModel>());
        await insertAutoVoidRequestQueueService.DidNotReceive().Execute(Arg.Any<int>(), Arg.Any<int?>(), Arg.Any<int[]>());
    }

    [Fact]
    public async Task Handle_ExecuteAddRequestError_ReturnError()
    {
        // Arrange
        var request = new AddTechnicalErrorAutoVoidRequest
        {
            TransId = 123,
            OperatorKey = "valid-operator-key"
        };

        var validOperatorResult = new Result { ErrorCode = 0 };
        operatorKeyEncryptionService.ValidateOperatorKey(request.OperatorKey).Returns(validOperatorResult);

        var ticketValidationResult = new CheckProviderMistakeTicketsResultModel
        {
            Validation = new ValidationProviderMistake
            {
                MatchId = 456,
                ValidTransIds = "123",
                InvalidTransIds = string.Empty,
                ExistingReqTransIds = string.Empty,
                UnsupportedTransIds = string.Empty
            },
            TransInfoAddRequest = new TransInfoAddRequestModel
            {
                MarkTransIds = "123",
                TransInfoJson = "{\"transIds\":[123]}"
            }
        };
        addRequestAutoVoidProviderMistakeService.ValidateTickets(request.TransId.ToString())
            .Returns((ticketValidationResult, (Result)null));

        var markTicketResult = new Result { ErrorCode = 0 };
        addRequestAutoVoidProviderMistakeService.MarkTickets(ticketValidationResult.TransInfoAddRequest.MarkTransIds)
            .Returns(markTicketResult);

        var addRequestError = new Result { ErrorCode = 1, ErrorMsg = "Failed to add void request" };
        addRequestAutoVoidProviderMistakeService.ExecuteAddRequest(
            ticketValidationResult.Validation.MatchId,
            ticketValidationResult)
            .Returns((0, addRequestError));

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.ErrorCode);
        Assert.Equal("Failed to add void request", result.ErrorMsg);

        operatorKeyEncryptionService.Received(1).ValidateOperatorKey(request.OperatorKey);
        await addRequestAutoVoidProviderMistakeService.Received(1).ValidateTickets(request.TransId.ToString());
        await addRequestAutoVoidProviderMistakeService.Received(1).MarkTickets(ticketValidationResult.TransInfoAddRequest.MarkTransIds);
        await addRequestAutoVoidProviderMistakeService.Received(1).ExecuteAddRequest(
            ticketValidationResult.Validation.MatchId,
            ticketValidationResult);
        await insertAutoVoidRequestQueueService.DidNotReceive().Execute(Arg.Any<int>(), Arg.Any<int?>(), Arg.Any<int[]>());
    }

    [Fact]
    public async Task Handle_EmptyOperatorKey_ReturnError()
    {
        // Arrange
        var request = new AddTechnicalErrorAutoVoidRequest
        {
            TransId = 123,
            OperatorKey = string.Empty
        };

        var emptyOperatorResult = new Result { ErrorCode = 403, ErrorMsg = "Operator key is required." };
        operatorKeyEncryptionService.ValidateOperatorKey(request.OperatorKey).Returns(emptyOperatorResult);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(403, result.ErrorCode);
        Assert.Equal("Operator key is required.", result.ErrorMsg);

        operatorKeyEncryptionService.Received(1).ValidateOperatorKey(request.OperatorKey);
        await addRequestAutoVoidProviderMistakeService.DidNotReceive().ValidateTickets(Arg.Any<string>());
    }
}

