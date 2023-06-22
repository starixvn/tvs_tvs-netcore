using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.TicketListing.Criteria;
using TicketVoidingSystem.TicketListing.Models;
using TicketVoidingSystem.TicketListing.Services.SendDataOic;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketListing.Services.SendDataOic;

public class InsertToAmendmentTableStageTests
{
    private readonly IDynamicRepository repository;
    private readonly LoggingService loggingService;
    private readonly InsertToAmendmentTableStageImp service;

    public InsertToAmendmentTableStageTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        loggingService = Substitute.For<LoggingService>();
        service = new InsertToAmendmentTableStageImp(repository, loggingService);
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
        var configuration = new ConfigurationManager();
        configuration["EnvironmentName"] = env;
        AppSettingService.InitSetting(configuration);
        repository.ExecuteAsync(Arg.Any<SendDataOicCriteria>()).ReturnsForAnyArgs(1);

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
        var excelOicModels = new List<ExcelOicModel>
            {
                new() { TransId = 1111 }
            };
        var query = new SendFileQuery { MatchId = 900001 };
        repository.ExecuteAsync(Arg.Any<SendDataOicBackupCriteria>()).ReturnsForAnyArgs(1);

        // Act
        var actual = await service.Execute(excelOicModels, query, "1");

        // Assert
        await repository.Received(1).ExecuteAsync(Arg.Any<SendDataOicCriteria>());
        Assert.True(actual);
    }

    [Fact]
    public async Task InsertToAmendmentTable_InsertToBackupDbHasException_ExecuteRepository()
    {
        // Arrange
        var exception = new Exception("Send Email Failed");
        var query = new SendFileQuery { MatchId = 900001 };
        
        // Act
        var actual = await service.Execute(null, query, "1");

        // Assert
        Assert.False(actual);
    }
}