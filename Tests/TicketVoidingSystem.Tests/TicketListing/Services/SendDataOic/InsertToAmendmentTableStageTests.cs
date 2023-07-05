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
    private readonly InsertToAmendmentTableStageImp service;

    public InsertToAmendmentTableStageTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new InsertToAmendmentTableStageImp(repository);
    }

    [Theory]
    [InlineData("UAT")]
    [InlineData("PRO")]
    [InlineData("PROAWS")]
    [InlineData("LOCAL")]
    public async Task InsertToAmendmentTable_ValidQuery_ExecuteRepository(string env)
    {
        // Arrange
        var excelOicModels = new ExcelOicModel();
        var query = new SendFileQuery { MatchId = 900001 };
        var configuration = new ConfigurationManager();
        configuration["EnvironmentName"] = env;
        AppSettingService.InitSetting(configuration);
        repository.FetchAsync<LicenseeFile>(Arg.Any<SendDataOicCriteria>()).ReturnsForAnyArgs(new List<LicenseeFile>());

        // Act
        _ = await service.Execute(excelOicModels, query);

        // Assert
        await repository.Received(1).FetchAsync<LicenseeFile>(Arg.Any<SendDataOicCriteria>());
    }

}