using Fanex.Data.Repository;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using Xunit;

namespace TicketVoidingSystem.TicketListing.Tests.Services.SendDataOic;

public class InsertToAmendmentTableStageTests
{
    [Fact]
    public async Task SendData_ValidQuery_ReturnAmendmentResponse()
    {
        // Arrange
        var expected = new AmendmentResponse
        {
            Code = 1,
            Message = ""
        };
        var queries = new List<SendFileQuery>
        {
            new() { LicenseeName = "", BetTypeName = "" }
        };
        var insertToAmendmentTableStage = Substitute.For<InsertToAmendmentTableStage>();
        var callApiAmendmentStage = Substitute.For<CallApiAmendmentStage>();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTicketsForSendDataOic(default!, default!).ReturnsForAnyArgs(new List<ExcelOicModel>());
        insertToAmendmentTableStage.Execute(default!, default!, default!).ReturnsForAnyArgs(true);
        callApiAmendmentStage.Execute(default!, default!, default!).ReturnsForAnyArgs(expected);
        var service = new SendDataToOicServiceImp(getTicketsService, insertToAmendmentTableStage, callApiAmendmentStage);

        // Act
        var actual = await service.Send(queries, "");

        // Assert
        await getTicketsService.Received(1).GetTicketsForSendDataOic(Arg.Any<SendFileQuery>(), Arg.Any<string>());
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("UAT")]
    [InlineData("PRO")]
    [InlineData("PROAWS")]
    [InlineData("LOCAL")]
    public async Task InsertToAmendmentTable_ValidQuery_ExecuteRepository(string env)
    {
        // Arrange
        var excelOicModels = new List<ExcelOicModel>
            {
                new() { TransId = 1111 }
            };
        var query = new SendFileQuery { MatchId = 900001 };
        var repository = Substitute.For<IDynamicRepository>();
        var configuration = new ConfigurationManager();
        var loggingService = Substitute.For<LoggingService>();
        configuration["EnvironmentName"] = env;
        AppSettingService.InitSetting(configuration);
        repository.ExecuteAsync(Arg.Any<SendDataOicCriteria>()).ReturnsForAnyArgs(1);
        repository.ExecuteAsync(Arg.Any<SendDataOicBackupCriteria>()).ReturnsForAnyArgs(1);
        var service = new InsertToAmendmentTableStageImp(repository, loggingService);

        // Act
        var actual = await service.Execute(excelOicModels, query, "1");

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<SendDataOicCriteria>());
        Assert.True(actual);
    }

    [Fact]
    public async Task InsertToAmendmentTable_InsertToMainDbException_ExecuteRepository()
    {
        // Arrange
        var exception = new Exception("Send Email Failed");
        var excelOicModels = new List<ExcelOicModel>
            {
                new() { TransId = 1111 }
            };
        var query = new SendFileQuery { MatchId = 900001 };
        var repository = Substitute.For<IDynamicRepository>();
        var configuration = new ConfigurationManager();
        var loggingService = Substitute.For<LoggingService>();
        configuration["EnvironmentName"] = "UAT";
        AppSettingService.InitSetting(configuration);
        repository.When(x => x.ExecuteAsync(Arg.Any<SendDataOicCriteria>()))
            .Do(y => throw exception);
        repository.ExecuteAsync(Arg.Any<SendDataOicBackupCriteria>()).ReturnsForAnyArgs(1);
        var service = new InsertToAmendmentTableStageImp(repository, loggingService);

        // Act
        var actual = await service.Execute(excelOicModels, query, "1");

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<SendDataOicCriteria>());
        await loggingService.Received(1).ErrorAsync(Arg.Any<string>(), Arg.Any<Exception>());
        Assert.True(actual);
    }

    [Fact]
    public async Task InsertToAmendmentTable_InsertToBackupDbHasException_ExecuteRepository()
    {
        // Arrange
        var exception = new Exception("Send Email Failed");
        var excelOicModels = new List<ExcelOicModel>
        {
            new() { TransId = 1111 }
        };
        var query = new SendFileQuery { MatchId = 900001 };
        var repository = Substitute.For<IDynamicRepository>();
        var configuration = new ConfigurationManager();
        var loggingService = Substitute.For<LoggingService>();
        configuration["EnvironmentName"] = "UAT";
        AppSettingService.InitSetting(configuration);
        repository.ExecuteAsync(Arg.Any<SendDataOicCriteria>()).ReturnsForAnyArgs(1);
        repository.When(x => x.ExecuteAsync(Arg.Any<SendDataOicBackupCriteria>()))
            .Do(y => throw exception);
        var service = new InsertToAmendmentTableStageImp(repository, loggingService);

        // Act
        var actual = await service.Execute(excelOicModels, query, "1");

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<SendDataOicCriteria>());
        await loggingService.Received(1).ErrorAsync(Arg.Any<string>(), Arg.Any<Exception>());
        Assert.True(actual);
    }
}