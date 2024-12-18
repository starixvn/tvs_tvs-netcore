using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Repositories;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.VoidTickets;

[Category("VoidByBetId")]
public class HandleServiceTest
{
    private static HandleServiceImp CreateService(VoidByBetIdRepository repository)
    {
        var mapper = Substitute.For<IMapper>();
        var loggingService = Substitute.For<LoggingService>();

        mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());

        return new HandleServiceImp(repository, loggingService);
    }

    [Fact]
    public async Task ExecuteQuery_HasCriteria_ReturnVoidTicketsFromRepository()
    {
        // Arrange
        var expected = new VoidTicketsModel
        {
            Tickets = new List<TicketEmailModel>()
        };
        var query = new VoidTicketsQuery { Password = "Test", SubIssueTypeName = "", SubIssueTypeNameCS = "" };
        var repository = Substitute.For<VoidByBetIdRepository>();
        repository
            .VoidTickets(Arg.Any<VoidTicketsQuery>())
            .ReturnsForAnyArgs(expected);
        var service = CreateService(repository);

        // Act
        var actual = await service.VoidTickets(query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public async Task ExecuteQuery_RepositoryThrowException_UpdateOutputParam()
    {
        // Arrange
        var exception = new Exception("Error Void Tickets");
        var validation = new VoidTicketValidation
        {
            ErrorCode = ErrorCode.ExecuteQueryFail,
            ErrorMsg = exception.Message
        };
        var expected = new VoidTicketsModel { Validation = validation };
        var query = new VoidTicketsQuery { Password = "Test" };
        var repository = Substitute.For<VoidByBetIdRepository>();
        repository
            .When(x => x.VoidTickets(Arg.Any<VoidTicketsQuery>()))
            .Do(_ => throw exception);
        var service = CreateService(repository);

        // Act
        var actual = await service.VoidTickets(query);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    private static HandleServiceImp CreateService(VoidByBetIdRepository repository, LoggingService loggingService)
    {
        return new HandleServiceImp(repository, loggingService);
    }

    [Fact]
    public async Task ExecuteQuery_RepositoryThrowException_WriteLog()
    {
        // Arrange
        var exception = new Exception("Error Void Tickets");
        var query = new VoidTicketsQuery { Password = "Test" };
        var repository = Substitute.For<VoidByBetIdRepository>();
        var loggingService = Substitute.For<LoggingService>();
        repository
            .When(x => x.VoidTickets(Arg.Any<VoidTicketsQuery>()))
            .Do(_ => throw exception);
        var service = CreateService(repository, loggingService);

        // Act
        await service.VoidTickets(query);

        // Assert
        await loggingService.Received().ErrorAsync(Arg.Is<Exception>(x => x.Message == exception.Message));
    }

    private static HandleServiceImp CreateService()
    {
        var repository = Substitute.For<VoidByBetIdRepository>();
        var loggingService = Substitute.For<LoggingService>();

        return new HandleServiceImp(repository, loggingService);
    }

    [Fact]
    public void CreateWarningMessage_ExistInvalidTrans_ReturnInvalidTransResult()
    {
        // Arrange
        var service = CreateService();

        // Act
        var actual = service.CreateWarningMessage(string.Empty);

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void CreateWarningMessage_ExistWarningCricket_ReturnInvalidTransResult()
    {
        // Arrange
        const string warningCricket = "Fail to update NetPosition Cricket Tickets!";
        var result = new Result
        {
            ErrorCode = ErrorCode.ExecuteQueryAPIFail,
            ErrorMsg = warningCricket
        };
        var expected = new List<Result> { result };
        var service = CreateService();

        // Act
        var actual = service.CreateWarningMessage(warningCricket);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}