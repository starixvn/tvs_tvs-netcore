using System.Collections.Generic;
using System.Threading;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest
{
    public class GetTicketsHandlerTests
    {
        // [Fact]
        // public void GetTickets_HaveTicketsDisplay_AssignDataTicket()
        // {
        //     // Arrange
        //     var request = new GetTicketsRequest();
        //     var listGroup = new List<Group<GetTicketModel>>
        //     {
        //         new Group<GetTicketModel>
        //         {
        //             Tickets = new List<GetTicketModel> { new GetTicketModel() }
        //         }
        //     };
        //     var data = new List<GetTicketModel>();
        //     var getTicketsService = Substitute.For<GetTicketsService>();
        //     var mapTicketsService = Substitute.For<MapTicketsService>();
        //     var pagingService = Substitute.For<PagingService>();
        //     var ticketsViewModelService = Substitute.For<TicketsViewModelService>();
        //     var checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
        //     var voidPermission = checkPermissionOnRequestService.GetVoidPermission().ReturnsForAnyArgs(new VoidPermission());

        //     getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        //     mapTicketsService.MapToGroupTicketViewModel(Arg.Any<Group<GetTicketModel>>(), Arg.Any<Match>(), Arg.Any<int>(),
        //     Arg.Any<int>(), Arg.Any<VoidPermission>()).ReturnsForAnyArgs(new Group<TicketViewModel>());
        //     pagingService.Paging(data, default, default).ReturnsForAnyArgs(new List<GetTicketModel> { new GetTicketModel() });
        //     pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);

        //     var handler = new GetTicketsHandler(getTicketsService, mapTicketsService, pagingService, ticketsViewModelService, checkPermissionOnRequestService);

        //     // Act
        //     var actual = handler.Handle(request, CancellationToken.None);

        //     // Assert
        //     Assert.NotNull(actual);
        // }

        // [Fact]
        // public async Task GetTickets_NotHaveAnyTickets_ReturnEmptyTicketViewModel()
        // {
        //     // Arrange
        //     var request = new GetTicketsRequest
        //     {
        //         IssueTypeId = 1,
        //         Match = new Match()
        //     };
        //     var data = new List<GetTicketModel>();
        //     var getTicketsService = Substitute.For<IGetTicketsService>();
        //     var handlerService = Substitute.For<HandlerService>();
        //     getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        //     var pagingService = Substitute.For<IPagingService>();
        //     pagingService.Paging(data, request.PageIndex, request.PageSize).ReturnsForAnyArgs(new List<GetTicketModel>());
        //     var handler = new GetTicketsHandler(getTicketsService, pagingService, handlerService);

        //     // Act
        //     var actual = await handler.Handle(request);

        //     // Assert
        //     getTicketsService.DidNotReceiveWithAnyArgs().AssignData(Arg.Compat.Any<Group<GetTicketModel>>(), Arg.Compat.Any<Match>(), Arg.Compat.Any<int>(), Arg.Compat.Any<int>());
        //     Assert.Zero(actual.Total);
        //     Assert.Zero(actual.TotalSingle);
        //     Assert.Zero(actual.TotalParlay);
        //     Assert.Zero(actual.Groups.Count);
        // }

        // [Fact]
        // public async Task GetTickets_HaveTickets_UpdateTicketViewModel()
        // {
        //     // Arrange
        //     var request = new GetTicketsRequest
        //     {
        //         IssueTypeId = 1,
        //         Match = new Match()
        //     };
        //     var listGroup = new List<Group<GetTicketModel>>
        //     {
        //         new Group<GetTicketModel>
        //         {
        //             Tickets = new List<GetTicketModel> { new GetTicketModel() }
        //         }
        //     };
        //     var data = new List<GetTicketModel> {
        //         new GetTicketModel { TransDate = new DateTime(2018, 10, 31, 10, 10, 10, 111), LicenseeName = "A" , GroupName = "Credit",
        //             IsMixParlay = false, IsCashOut = false, BetType = 1, TransId = 109271429520, Status = "draw", SubStatus = ""},
        //         new GetTicketModel { TransDate = new DateTime(2018, 10, 31, 9, 10, 10, 111), LicenseeName = "B" , GroupName = "Deposit",
        //             IsMixParlay = false, IsCashOut = false, BetType = 2, TransId = 109271429521, Status = "draw", SubStatus = "" },
        //         new GetTicketModel { TransDate = new DateTime(2018, 10, 30, 16, 20, 20, 222), LicenseeName = "C" , GroupName = "8RM/BARM",
        //             IsMixParlay = true, IsCashOut = false, BetType = 3, TransId = 109271429522, BetdaqId = 1, Status = "draw", SubStatus = ""},
        //         new GetTicketModel { TransDate = new DateTime(2018, 10, 30, 15, 20, 20, 222), LicenseeName = "D" , GroupName = "8rm/barm (Instant Settlement)",
        //             IsMixParlay = false, IsCashOut = false, BetType = 4, TransId = 109271429523, BetdaqId = 2, Status = "draw", SubStatus = "" },
        //         new GetTicketModel { TransDate = new DateTime(2018, 10, 30, 15, 20, 20, 222), LicenseeName = "D" , GroupName = "Deposit (Instant Settlement)",
        //             IsMixParlay = true, IsCashOut = false, BetType = 4, TransId = 109271429523, BetdaqId = 2, Status = "draw", SubStatus = ""},
        //         new GetTicketModel { TransDate = new DateTime(2018, 10, 30, 15, 20, 20, 222), LicenseeName = "D" , GroupName = "phone betting",
        //             IsMixParlay = false, IsCashOut = false, BetType = 4, TransId = 109271429523, BetdaqId = 1, Status = "draw", SubStatus = "" },
        //         new GetTicketModel { TransDate = new DateTime(2018, 10, 30, 15, 20, 20, 222), LicenseeName = "D" , GroupName = "phone betting",
        //             IsMixParlay = false, IsInstantSettlement  = true, BetType = 4, TransId = 109271429524, BetdaqId = 1, Status = "draw", SubStatus = "", IsDeposit = true },
        //         new GetTicketModel { TransDate = new DateTime(2018, 10, 30, 15, 20, 20, 222), LicenseeName = "D" , GroupName = "phone betting",
        //             IsMixParlay = false, IsCashOut  = true, BetType = 4, TransId = 109271429525, BetdaqId = 1, Status = "draw", SubStatus = "", IsDeposit = true }
        //     };
        //     var permission = new VoidPermission
        //     {
        //         InstantlySettled = true,
        //         UnSettled = true,
        //         Settled = true
        //     };
        //     var getTicketsService = Substitute.For<IGetTicketsService>();
        //     var handlerService = Substitute.For<HandlerService>();
        //     getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
        //     getTicketsService.AssignData(Arg.Compat.Any<Group<GetTicketModel>>(), Arg.Compat.Any<Match>(), Arg.Compat.Any<int>(), Arg.Compat.Any<int>())
        //         .ReturnsForAnyArgs(new Group<TicketViewModel>());
        //     getTicketsService.GetPermission().Returns(permission);
        //     var pagingService = Substitute.For<IPagingService>();
        //     pagingService.Paging(data, request.PageIndex, request.PageSize).ReturnsForAnyArgs(new List<GetTicketModel> { new GetTicketModel() });
        //     pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);
        //     handlerService.UpdateViewModel(Arg.Any<TicketsViewModel>(), Arg.Any<List<GetTicketModel>>(), request.IssueTypeId);

        //     var handler = new GetTicketsHandler(getTicketsService, pagingService, handlerService);

        //     // Act
        //     var model = await handler.Handle(request);

        //     // Assert
        //     getTicketsService.Received().GetTickets(request);
        //     getTicketsService.Received().AssignData(Arg.Compat.Any<Group<GetTicketModel>>(), Arg.Compat.Any<Match>(), Arg.Compat.Any<int>(), Arg.Compat.Any<int>());
        //     handlerService.Received().UpdateViewModel(Arg.Any<TicketsViewModel>(), Arg.Any<List<GetTicketModel>>(),
        //         request.IssueTypeId);
        // }
    }
}