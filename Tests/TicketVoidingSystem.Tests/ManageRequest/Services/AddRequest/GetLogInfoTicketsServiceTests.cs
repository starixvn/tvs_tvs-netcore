using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest
{
    public class GetLogInfoTicketServiceTests
    {
        public MapTicketsService mapTicketsService = Substitute.For<MapTicketsService>();
        public CompressDataService compressDataService = Substitute.For<CompressDataService>();
        public GetLogInfoTicketsService service;

        [Fact]
        public void GetTicketsViewModel_ShouldReturnEmptyViewModel_WhenNoTickets()
        {
            // Arrange
            var getTicketModels = Enumerable.Empty<GetTicketModel>();

            var request = new GetLogInfoTicketsRequest
            {
                LogInfoTicketsJson = "",
                IssueTypeId = 1
            };
            compressDataService.DecompressTickets(request.LogInfoTicketsJson).Returns(getTicketModels);

            service = new GetLogInfoTicketsServiceImp(null, compressDataService);

            // Act
            var result = service.GetTicketsViewModel(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.TotalSingle);
            Assert.Empty(result.Groups);
        }

        [Fact]
        public void GetTicketsViewModel_ShouldReturnViewModelWithTickets_WhenTicketsExist()
        {
            // Arrange
            var request = new GetLogInfoTicketsRequest
            {
                LogInfoTicketsJson = "compressedData",
                IssueTypeId = 1
            };

            var getTicketModels = new List<GetTicketModel>
            {
                new() { SubBetType = 2, IsMixParlay = true, Status = "Won", SubStatus = "won", GroupName = "Parlay"},
                new() { SubBetType = 3, Status = "Won", SubStatus = "won", GroupName = "Parlay" }
            };
            var ticketParlay = new TicketViewModel { BetType = "Handicap", IsParlay = true, Status = "Won", GroupName = "Parlay" };
            var ticketSingle = new TicketViewModel { BetType = "Handicap", Status = "Won", GroupName = "Credit" };

            compressDataService.DecompressTickets(request.LogInfoTicketsJson).Returns(getTicketModels);
            mapTicketsService.MapFromGetTicketModelToTicketViewModel(Arg.Is<GetTicketModel>(x => x.IsMixParlay), null, ChoiceType.None, 1).Returns(ticketParlay);
            mapTicketsService.MapFromGetTicketModelToTicketViewModel(Arg.Is<GetTicketModel>(x => !x.IsMixParlay), null, ChoiceType.None, 1).Returns(ticketSingle);

            service = new GetLogInfoTicketsServiceImp(mapTicketsService, compressDataService);

            // Act
            var result = service.GetTicketsViewModel(request);

            // Assert
            Assert.Equal(1, result.TotalSingle);
            Assert.Equal(1, result.TotalParlay);
            Assert.Equal(2, result.Groups.Count());
            Assert.Equal("Credit", result.Groups.First().Name);
        }

        [Fact]
        public void GetTicketsViewModel_ShouldReturnViewModelWithTickets_WhenOnlyTicketsParlay()
        {
            // Arrange
            var request = new GetLogInfoTicketsRequest
            {
                LogInfoTicketsJson = "compressedData",
                IssueTypeId = 1
            };

            var getTicketModels = new List<GetTicketModel>
            {
                new() { SubBetType = 2, IsMixParlay = true, Status = "Won", SubStatus = "won", GroupName = "Parlay" },
                new() { SubBetType = 3, IsMixParlay = false, Status = "Won", SubStatus = "won", GroupName = "Parlay" }
            };
            var ticketParlay = new TicketViewModel { BetType = "Handicap", IsParlay = true, Status = "Won", GroupName = "Parlay" };
            var ticketSingle = new TicketViewModel { BetType = "Handicap", Status = "Won", GroupName = "Credit" };

            compressDataService.DecompressTickets(request.LogInfoTicketsJson).Returns(getTicketModels);
            mapTicketsService.MapFromGetTicketModelToTicketViewModel(Arg.Is<GetTicketModel>(x => x.IsMixParlay), null, ChoiceType.None, 1).Returns(ticketParlay);
            mapTicketsService.MapFromGetTicketModelToTicketViewModel(Arg.Is<GetTicketModel>(x => !x.IsMixParlay), null, ChoiceType.None, 1).Returns(ticketSingle);

            service = new GetLogInfoTicketsServiceImp(mapTicketsService, compressDataService);

            // Act
            var result = service.GetTicketsViewModel(request);

            // Assert
            Assert.Equal(1, result.TotalSingle);
            Assert.Equal(1, result.TotalParlay);
            Assert.Equal(2, result.Groups.Count());
            Assert.Equal("Parlay", result.Groups.Last().Name);
        }

        [Fact]
        public void GetTicketsViewModel_ShouldReturnViewModelWithTickets_WhenOnlyTicketsSingle()
        {
            // Arrange
            var request = new GetLogInfoTicketsRequest
            {
                LogInfoTicketsJson = "compressedData",
                IssueTypeId = 1
            };

            var getTicketModels = new List<GetTicketModel>
            {
                new() { SubBetType = 2, Status = "Won", SubStatus = "won", GroupName = "Parlay", IsMixParlay = false }
            };
            var ticketSingle = new TicketViewModel { BetType = "Handicap", Status = "Won", GroupName = "Credit" };

            compressDataService.DecompressTickets(request.LogInfoTicketsJson).Returns(getTicketModels);
            mapTicketsService.MapFromGetTicketModelToTicketViewModel(Arg.Is<GetTicketModel>(x => !x.IsMixParlay), null, ChoiceType.None, 1).Returns(ticketSingle);

            service = new GetLogInfoTicketsServiceImp(mapTicketsService, compressDataService);

            // Act
            var result = service.GetTicketsViewModel(request);

            // Assert
            Assert.Equal(1, result.TotalSingle);
            Assert.Equal(0, result.TotalParlay);
            Assert.Single(result.Groups);
            Assert.Equal("Credit", result.Groups.First().Name);
        }
    }
}