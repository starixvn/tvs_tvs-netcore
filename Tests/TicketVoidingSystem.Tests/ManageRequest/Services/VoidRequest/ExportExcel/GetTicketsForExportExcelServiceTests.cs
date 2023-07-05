using System.Collections.Generic;
using NSubstitute;
using System.Threading.Tasks;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;
using TicketVoidingSystem.Models;
using AutoMapper;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.ExportExcel;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest.ExportExcel
{
    public class GetTicketsForExportExcelServiceTests
    {
        private readonly IMapper mapper;
        private readonly GetTicketsService getTicketsService;
        private readonly MapTicketsService mapTicketsService;
        private readonly PagingService pagingService;
        private readonly GetTicketsForExportExcelService service;

        public GetTicketsForExportExcelServiceTests()
        {
            mapper = Substitute.For<IMapper>();
            getTicketsService = Substitute.For<GetTicketsService>();
            mapTicketsService = Substitute.For<MapTicketsService>();
            pagingService = Substitute.For<PagingService>();
            service = new GetTicketsForExportExcelServiceImp(mapper, getTicketsService, mapTicketsService, pagingService);
        }

        [Fact]
        public async Task MapToGroupTicketViewModel_HasNoTicket_ReturnNewListGroup()
        {
            // Arrange
            var query = new GetTicketsQuery { };
            var data = new List<GetTicketModel> { };
            getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>()).Returns(data);
            var expected = new List<Group<ExcelTicketModel>>();

            // Act
            var result = service.GetGroupsExcelTickets(query);

            // Assert

            AssertExtension.Equal(expected, result.Result);
        }

        [Fact]
        public async Task MapToGroupTicketViewModel_HasTicket_ReturnExpectedValue()
        {
            // Arrange
            var query = new GetTicketsQuery { IssueTypeId  = 1};
            var data = new List<GetTicketModel> { new GetTicketModel { IsMixParlay = false, GroupName  = "a"},
                new GetTicketModel { IsMixParlay = true, GroupName  = "a"} };
            getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>()).Returns(data);
            var expected = new List<Group<ExcelTicketModel>>();
            var groups = new List<Group<GetTicketModel>> { 
                new Group<GetTicketModel> { Tickets = new List<GetTicketModel> { 
                    new GetTicketModel { BetType  = 38, IsMixParlay = true } } } };            
            pagingService.Groups(Arg.Any<List<GetTicketModel>>(), default).ReturnsForAnyArgs(groups);
            var ticketDetail = new TicketViewModel
            {
                BetId = "1",
                Member = "a",
                Odds = "1",
                Status = "1",
                Choice = "123"
            };
            var excelTicket = new ExcelTicketNoMatchModel { };
            mapper.Map<ExcelTicketNoMatchModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(excelTicket);
            mapTicketsService.MapFromGetTicketModelToTicketViewModel(Arg.Any<GetTicketModel>(), Arg.Any<Match>(), default, default)
               .ReturnsForAnyArgs(ticketDetail);

            mapper.Map<ExcelTicketModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(new ExcelTicketModel { });

            // Act
            var result = service.GetGroupsExcelTickets(query);

            // Assert

            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetGroupsExcelTicketsRequestNoMatch_HasTicket_ReturnExpected()
        {
            // Arrange
            var query = new GetTicketsQuery { };
            var data = new List<GetTicketModel> { new GetTicketModel { IsMixParlay = false, GroupName  = "a"},
                new GetTicketModel { IsMixParlay = true, GroupName  = "a"} };
            getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>()).Returns(data);
            var expected = new List<Group<ExcelTicketNoMatchModel>>();
            var groups = new List<Group<GetTicketModel>> {
                new Group<GetTicketModel> { Tickets = new List<GetTicketModel> {
                    new GetTicketModel { BetType  = 38, IsMixParlay = true } } } };
            var ticketDetail = new TicketViewModel
            {
                BetId = "1",
                Member = "a",
                Odds = "1",
                Status = "1",
                Choice = "123"
            };
            pagingService.Groups(Arg.Any<List<GetTicketModel>>(), default).ReturnsForAnyArgs(groups);
            var excelTicket = new ExcelTicketNoMatchModel { };
            mapper.Map<ExcelTicketNoMatchModel>(Arg.Any<TicketViewModel>()).ReturnsForAnyArgs(excelTicket);
            mapTicketsService.MapFromGetTicketModelToTicketViewModel(Arg.Any<GetTicketModel>(), Arg.Any<Match>(), default, default)
               .ReturnsForAnyArgs(ticketDetail);
            // Act
            var result = service.GetGroupsExcelTicketsRequestNoMatch(query);

            // Assert

            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetGroupsExcelTicketsRequestNoMatch_HasNoTicket_ReturnNewListGroup()
        {
            // Arrange
            var query = new GetTicketsQuery { };
            var data = new List<GetTicketModel> { };
            getTicketsService.GetTickets(Arg.Any<GetTicketsQuery>()).Returns(data);
            var expected = new List<Group<ExcelTicketNoMatchModel>>();

            // Act
            var result = service.GetGroupsExcelTicketsRequestNoMatch(query);

            // Assert

            AssertExtension.Equal(expected, result.Result);
        }
    }
}
