using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.RecoverTicket;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.RecoverTicket;

public class CheckRecoverTicketServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly GetTransInfoService getTransInfoService;
    private readonly CheckRecoverTicketServiceImp service;

    public CheckRecoverTicketServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        service = new CheckRecoverTicketServiceImp(repository, getTransInfoService);
    }

    [Fact]
    public async Task CheckRecoverTicket_ValidRequest_RepositoryHasCalled()
    {
        // Arrange
        var request = new CheckRecoverTicketRequest { RequestId = 1 };
        var viewModels = new CheckRecoverTicketViewModel
        {
            ExistingReqTransIds = "1",
            InvalidTransIds = "1",
            TransInfoJson = "1",
            UnsupportedDateRangeTransIds = "1"
        };
        getTransInfoService.GetTransInfoJson(null).ReturnsForAnyArgs(new List<string>());
        repository.GetAsync<CheckRecoverTicketViewModel>(null).ReturnsForAnyArgs(viewModels);

        // Act
        var actual = await service.CheckRecoverTicket(request);

        // Assert
        await repository.Received(1).GetAsync<CheckRecoverTicketViewModel>(Arg.Any<CheckRecoverTicketCriteria>());
        await getTransInfoService.Received(1).GetTransInfoJson(Arg.Any<GetTransInfoQuery>());
        Assert.Equal(actual, viewModels);
    }
}
