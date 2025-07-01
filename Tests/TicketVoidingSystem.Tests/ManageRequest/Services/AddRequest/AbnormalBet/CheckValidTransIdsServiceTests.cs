using System.Collections.Generic;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalBet;

public class CheckValidTransIdsServiceTests
{
    private readonly MapAbnormalBetTicketsExcelService mapTicketsExcelService;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly CheckServerStatusService checkServerStatusService;
    private readonly GetInfoSiteDbDownService getInfoSiteDbDownService;
    private readonly IDynamicRepository repository;
    private readonly CheckValidTransIdsService service;

    public CheckValidTransIdsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        matchInfoAddRequestService = Substitute.For<MatchInfoAddRequestService>();
        mapTicketsExcelService = Substitute.For<MapAbnormalBetTicketsExcelService>();
        checkServerStatusService = Substitute.For<CheckServerStatusService>();
        getInfoSiteDbDownService = Substitute.For<GetInfoSiteDbDownService>();

        service = new CheckValidTransIdsServiceImp(repository, matchInfoAddRequestService,
            mapTicketsExcelService, checkServerStatusService, getInfoSiteDbDownService);
    }

    [Fact]
    public void MapValidationAbnormalBet_Should_Return_ModelExpected()
    {
        var validationAbnormalBets = new List<ValidationAbnormalBet>(){
            new (){
                InvalidTransIds = "123,456,789,100",
                MovedTransIds = "123,456,789,100",
                ABWhiteListTransIds = "",
                DifferentMatchTransIds = "123",
                SettledTransIds = "100",
                IsHasWarningRemovedTickets = true,
            },
            new (){
                InvalidTransIds = "123,789, 100",
                MovedTransIds = "123,456,789,100",
                ABWhiteListTransIds = "",
                DifferentMatchTransIds = "789,100",
                SettledTransIds = "",
                IsHasWarningRemovedTickets = false,
            },
            new (){
                InvalidTransIds = "456,789",
                MovedTransIds = "123,456,789,100",
                ABWhiteListTransIds = "",
                DifferentMatchTransIds = "789",
                SettledTransIds = "123",
                IsHasWarningRemovedTickets = false,
            }
        };
        var modelExpected = new ValidationAbnormalBet
        {
            InvalidTransIds = "789",
            MovedTransIds = "123,456,789,100",
            ABWhiteListTransIds = "",
            DifferentMatchTransIds = "123,789,100",
            SettledTransIds = "100, 123",
            IsHasWarningRemovedTickets = true,
        };

        var result = service.MapValidationAbnormalBet(validationAbnormalBets);

        Assert.Equal(modelExpected, result);
    }
}