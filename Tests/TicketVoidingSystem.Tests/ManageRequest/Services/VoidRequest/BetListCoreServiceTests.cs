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

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest
{
    public class BetListCoreServiceTests
    {
        private readonly BetListService betListService;
        private readonly IMapper mapper;
        private readonly BetListCoreServiceImp service;

        public BetListCoreServiceTests()
        {
            betListService = Substitute.For<BetListService>();
            mapper = Substitute.For<IMapper>();
            service = new BetListCoreServiceImp(mapper, betListService);
        }

        [Fact]
        public void GetTicket_ExportExcelBetBuilder_BetListServiceHasCalled()
        {
            // Arrange
            var item = new GetTicketModel
            {
                BetType = 31,
                IsLiveIndicator = true,
                BetdaqId = 1,
                IsMixParlay = true,
                SubTransId = 1,
                Hdp1 = 1,
                Hdp2 = 2,
                OddsType = 3,
                RefNo = 4,
                AwayId = 1,
                HomeId = 0,
                LeagueId = 3
            };
            var match = new Match();
            var choiceType = ChoiceType.Excel;
            var issueTypeId = 11;
            betListService.GetOdds(Arg.Any<Ticket>(), false).ReturnsForAnyArgs("a");
            betListService.BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>()).ReturnsForAnyArgs("b");
            betListService.GetBetTypeName(Arg.Any<Ticket>()).ReturnsForAnyArgs("c");
            betListService.GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("d");
            betListService.BuildChoiceExcel(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("11");
            betListService.GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("a");
            mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());

            // Act
            var actual = service.GetTicket(item, match, choiceType, issueTypeId);

            // Assert
            Assert.NotNull(actual);
            betListService.Received().GetOdds(Arg.Any<Ticket>(), false);
            betListService.Received().BuildStake(Arg.Any<Ticket>(), Arg.Any<TicketHelper>());
            betListService.Received().GetBetTypeName(Arg.Any<Ticket>());
            betListService.Received().GetStatus(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false);
            betListService.Received().GetHandicap(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false);
            betListService.Received().BuildChoiceExcel(Arg.Any<Ticket>(), Arg.Any<TicketHelper>(), null, false);
        }

        [Fact]
        public void GetTicket_ExportExcelBetBuilder_HasBuildChoice()
        {
            // Arrange
            var item = new GetTicketModel
            {
                BetType = 31,
                IsLiveIndicator = true,
                BetdaqId = 1,
                IsMixParlay = true,
                SubTransId = 1,
                Hdp1 = 1,
                Hdp2 = 2,
                OddsType = 3,
                RefNo = 4,
                AwayId = 1,
                HomeId = 0,
                LeagueId = 3
            };
            var choiceType = new ChoiceType();
            var issueTypeId = 11;
            betListService.BuildChoice(Arg.Any<ITicket>(), Arg.Any<TicketHelper>(), null, false).ReturnsForAnyArgs("aa");
            mapper.Map<Ticket>(Arg.Any<GetTicketModel>()).ReturnsForAnyArgs(new Ticket());

            // Act
            var actual = service.GetTicket(item, null, choiceType, issueTypeId);

            // Assert
            Assert.NotNull(actual);
            betListService.Received().BuildChoice(Arg.Any<ITicket>(), Arg.Any<TicketHelper>(), null, false);
        }

    }
}