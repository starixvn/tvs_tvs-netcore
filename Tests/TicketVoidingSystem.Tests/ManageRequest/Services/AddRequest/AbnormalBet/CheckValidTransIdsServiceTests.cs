using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalBet.ExportExcel;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.AbnormalBet;

public class CheckValidTransIdsServiceTests
{
    private readonly GetTransInfoService getTransInfoService;
    private readonly MapAbnormalBetTicketsExcelService mapTicketsExcelService;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly IDynamicRepository repository;
    private readonly CheckValidTransIdsService service;

    public CheckValidTransIdsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        matchInfoAddRequestService = Substitute.For<MatchInfoAddRequestService>();
        getTransInfoService = Substitute.For<GetTransInfoService>();
        mapTicketsExcelService = Substitute.For<MapAbnormalBetTicketsExcelService>();

        service = new CheckValidTransIdsServiceImp(repository, matchInfoAddRequestService, getTransInfoService,
            mapTicketsExcelService);
    }

    [Fact]
    public async Task CheckValidTransIds_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckValidTransIdsRequest();
        var validation = new ValidationAbnormalBet();
        var transInfoAddRequestModel = new TransInfoAddRequestModel { UnMarkTransIds = "123", RemoveTransIds = "123", MarkTransIds = "456" };
        var matchInfoAddRequests = new[] { new MatchInfoAddRequest() };
        var validationAbnormalBets = new[] { validation };
        var transInfoAddRequestModels = new[] { transInfoAddRequestModel };
        var transInfoJsonOutputList = new[] { "123" };
        var abnormalBetTicketRequests = new[] { new GetAbnormalBetTicketModel() };
        var sendLetstalkModels = new[] { new SendLetsTalkModel() };
        var abnormalBetTicketModels = new List<AbnormalBetTicketViewModel> { new() };
        var match = new MatchInfoAddRequest();

        matchInfoAddRequestService.UpdateDataFromRemotingRef(Arg.Any<MatchInfoAddRequest>())
            .ReturnsForAnyArgs(match);
        repository.FetchMultipleAsync<MatchInfoAddRequest, ValidationAbnormalBet, TransInfoAddRequestModel, string, GetAbnormalBetTicketModel, SendLetsTalkModel>(Arg.Any<CheckValidTransIdsCriteria>())
            .ReturnsForAnyArgs((matchInfoAddRequests, validationAbnormalBets, transInfoAddRequestModels, transInfoJsonOutputList, abnormalBetTicketRequests, sendLetstalkModels));
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>())
            .ReturnsForAnyArgs(new List<string> { "123", "" });
        mapTicketsExcelService.MapDataToAbnormalBetTicketViewModel(Arg.Any<IEnumerable<GetAbnormalBetTicketModel>>())
            .ReturnsForAnyArgs(abnormalBetTicketModels);

        var viewModel = new ValidTransIdsModel
        {
            Matches = new List<MatchInfoAddRequest>(),
            Validation = validation,
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = "123",
                UnMarkTransIds = "123",
                MarkTransIds = "456",
                TransInfoJson = "123"
            },
            AbnormalBetTicketRequests = abnormalBetTicketModels,
            SendLetstalkModels = sendLetstalkModels
        };

        // Act
        var actual = await service.CheckValidTransIds(request);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }

    [Fact]
    public async Task CheckValidTransIds_NoHasTransInfoAddRequestModel_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckValidTransIdsRequest();
        var validation = new ValidationAbnormalBet();
        var matchInfoAddRequests = new[] { new MatchInfoAddRequest() };
        var validationAbnormalBets = new[] { validation };
        var transInfoAddRequestModels = new[] { new TransInfoAddRequestModel() };
        var transInfoJsonOutputList = new[] { "123" };
        var abnormalBetTicketRequests = new[] { new GetAbnormalBetTicketModel() };
        var sendLetstalkModels = new[] { new SendLetsTalkModel() };
        var abnormalBetTicketModels = new List<AbnormalBetTicketViewModel>();
        var match = new MatchInfoAddRequest();

        matchInfoAddRequestService.UpdateDataFromRemotingRef(Arg.Any<MatchInfoAddRequest>())
            .ReturnsForAnyArgs(match);
        repository.FetchMultipleAsync<MatchInfoAddRequest, ValidationAbnormalBet, TransInfoAddRequestModel, string, GetAbnormalBetTicketModel, SendLetsTalkModel>(Arg.Any<CheckValidTransIdsCriteria>())
            .ReturnsForAnyArgs((matchInfoAddRequests, validationAbnormalBets, transInfoAddRequestModels, transInfoJsonOutputList, abnormalBetTicketRequests, sendLetstalkModels));
        getTransInfoService.GetTransInfoJson(Arg.Any<GetTransInfoQuery>())
            .ReturnsForAnyArgs(new List<string> { "123", "" });
        mapTicketsExcelService.MapDataToAbnormalBetTicketViewModel(Arg.Any<IEnumerable<GetAbnormalBetTicketModel>>())
            .ReturnsForAnyArgs(abnormalBetTicketModels);

        var viewModel = new ValidTransIdsModel
        {
            Matches = new List<MatchInfoAddRequest>(),
            Validation = validation,
            TransInfoAddRequestModel = new TransInfoAddRequestModel
            {
                RemoveTransIds = null,
                UnMarkTransIds = null,
                MarkTransIds = null,
                TransInfoJson = "123"
            },
            AbnormalBetTicketRequests = abnormalBetTicketModels,
            SendLetstalkModels = sendLetstalkModels
        };

        // Act
        var actual = await service.CheckValidTransIds(request);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }
}