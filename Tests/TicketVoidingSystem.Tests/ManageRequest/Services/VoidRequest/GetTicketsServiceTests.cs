using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using Xunit;
using AutoMapper;
using TicketVoidingSystem.Models;
using Fanex.BetList.Core.Templates;
using TicketVoidingSystem.Services.BetList;
using Fanex.BetList.Core.Entities;
using Fanex.BetList.Core.TicketHelper;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.DataCollection;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest
{
    public class GetTicketsServiceTests
    {
        private readonly GetTransInfoService getTransInfoService;
        private readonly IMapper mapper;
        private readonly IDynamicRepository repository;

        private readonly GetTicketsServiceImp service;

        public GetTicketsServiceTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            mapper = Substitute.For<IMapper>();
            getTransInfoService = Substitute.For<GetTransInfoService>();
            service = new GetTicketsServiceImp(mapper, repository, getTransInfoService);
        }

        [Theory]
        [InlineData(IssueTypeConstant.EarlyKickOffTime)]
        [InlineData(IssueTypeConstant.WrongKickOffTime)]
        [InlineData(IssueTypeConstant.ArchivedTicket)]
        [InlineData(IssueTypeConstant.AbnormalAccount)]
        [InlineData(0)]
        public async Task GetTickets_HasRequestIdNot0_HasCallGetTicket(int issueTypeId)
        {
            // Arrange
            var query = new GetTicketsQuery { IssueTypeId = issueTypeId, RequestId = 2 };
            var tickets = new List<BetId> { new BetId { }, new BetId { } };
            var ticketModels = new List<GetTicketModel> { new GetTicketModel { IsMixParlay  = true} };
            repository.FetchMultipleAsync<BetId, BetId, BetId>(Arg.Any<GetTicketInRequestCriteria>())
                .ReturnsForAnyArgs((tickets, tickets, tickets));
            getTransInfoService.GetTransInfoJsonForVoid(Arg.Any<List<BetId>>(), Arg.Any<List<BetId>>(), Arg.Any<List<BetId>>(), default)
                .ReturnsForAnyArgs(new List<string> { "1"});
            mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
            repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
            getTransInfoService.GetTransInfoJsonForVoid14(Arg.Any<List<BetId>>()).Returns(new List<string> { "1" });
            repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

            // Act
            var result = service.GetTickets(query);

            // Assert
            Assert.NotNull(result);
            await repository.Received().FetchMultipleAsync<BetId, BetId, BetId>(Arg.Any<GetTicketInRequestCriteria>());
        }

        [Fact]
        public async Task GetTickets_HasRequestIdIs0_HasGetBetTransTicket()
        {
            // Arrange
            var query = new GetTicketsQuery { IssueTypeId = 8, RequestId = 0 };
            var tickets = new List<BetId> { new BetId { }, new BetId { } };
            var ticketModels = new List<GetTicketModel> { new GetTicketModel { IsMixParlay = true } };
            repository.FetchMultipleAsync<BetId, BetId, BetId>(Arg.Any<GetTicketInRequestCriteria>())
                .ReturnsForAnyArgs((tickets, tickets, tickets));
            getTransInfoService.GetTransInfoJsonForVoid(Arg.Any<List<BetId>>(), Arg.Any<List<BetId>>(), Arg.Any<List<BetId>>(), default)
                .ReturnsForAnyArgs(new List<string> { "1" });
            mapper.Map<GetTicketsCriteria>(Arg.Any<GetTicketsQuery>()).Returns(new GetTicketsCriteria());
            repository.FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>()).Returns(ticketModels);
            getTransInfoService.GetTransInfoJsonForVoid14(Arg.Any<List<BetId>>()).Returns(new List<string> { "1" });
            repository.FetchAsync<GetTicketModel>(Arg.Any<GetBetTrans14TicketsCriteria>()).Returns(ticketModels);

            // Act
            var result = service.GetTickets(query);

            // Assert
            Assert.NotNull(result);
            await repository.Received().FetchAsync<GetTicketModel>(Arg.Any<GetTicketsCriteria>());
        }
    }
}