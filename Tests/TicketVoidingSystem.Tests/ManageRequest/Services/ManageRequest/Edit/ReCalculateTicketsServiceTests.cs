using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.Edit;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class ReCalculateTicketsServiceTests : IClassFixture<AppSettingFixture>
{
    private readonly IDynamicRepository repository;
    private readonly ReCalculateTicketsServiceImp service;
    private readonly SessionService sessionService;
    private readonly LoggingService loggingService;

    public ReCalculateTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        sessionService = Substitute.For<SessionService>();
        loggingService = Substitute.For<LoggingService>();
        service = new ReCalculateTicketsServiceImp(repository, sessionService, loggingService);
    }

    [Fact]
    public async Task Execute_HasException_ReturnExpected()
    {
        // Arrange
        var abnormalBetInfo = new AbnormalBetViewModel { IsConfirmCalculator = true };
        const int issueTypeId = IssueTypeConstant.AbnormalBet;
        const string transIds = "1, 2";
        var e = new Exception();
        repository.ExecuteAsync(Arg.Any<ReCalculateTicketCommand>()).Throws(e);
        sessionService.GetClientIp().Returns("127:00:42");
        var results = new List<Result> { new() { ErrorCode = 1, ErrorMsg = e.Message } };

        // Act
        var actual = await service.Execute(abnormalBetInfo, issueTypeId, transIds);

        // Assert
        await loggingService.Received(1).ErrorAsync(e);
        AssertExtension.Equal(results, actual);
    }

    [Theory]
    [InlineData(IssueTypeConstant.DangerAccepted, "1, 2", true)]
    [InlineData(IssueTypeConstant.AbnormalBet, "", true)]
    [InlineData(IssueTypeConstant.AbnormalBet, "1, 2", false)]
    public async Task Execute_HasDataNotValidParallel_ReturnExpected(int issueTypeId, string transIds, bool isConfirmCalculator)
    {
        // Arrange
        var abnormalBetInfo = new AbnormalBetViewModel { IsConfirmCalculator = isConfirmCalculator };
        var results = new List<Result>();

        // Act
        var actual = await service.Execute(abnormalBetInfo, issueTypeId, transIds);

        // Assert
        await loggingService.Received(0).ErrorAsync(Arg.Any<Exception>());
        await repository.Received(0).ExecuteAsync(Arg.Any<ReCalculateTicketCommand>());
        AssertExtension.Equal(results, actual);
    }

    [Theory]
    [InlineData(FilterByConstant.MixParlay)]
    [InlineData(FilterByConstant.SystemParlay)]
    public async Task Execute_HasValidData_ReturnExpected(int filterBy)
    {
        // Arrange
        var abnormalBetInfo = new AbnormalBetViewModel { IsConfirmCalculator = true, FilterBy = filterBy };
        const int issueTypeId = IssueTypeConstant.AbnormalBet;
        const string transIds = "1, 2";
        sessionService.GetClientIp().Returns("127:00:42");
        var results = new List<Result> { new() { ErrorMsg = null }, new() { ErrorMsg = null }, new() { ErrorMsg = null }, new() { ErrorMsg = null } };

        // Act
        var actual = await service.Execute(abnormalBetInfo, issueTypeId, transIds);

        // Assert
        await loggingService.Received(0).ErrorAsync(Arg.Any<Exception>());
        await repository.Received(4).ExecuteAsync(Arg.Any<ReCalculateTicketCommand>());
        AssertExtension.Equal(results, actual);
    }
}