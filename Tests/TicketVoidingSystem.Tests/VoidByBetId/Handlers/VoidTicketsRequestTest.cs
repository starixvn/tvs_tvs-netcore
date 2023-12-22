using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByBetId.Handlers;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.JackTimeCashOut;
using TicketVoidingSystem.Services.NetPosition;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Handlers
{
    [Category("VoidByBetId")]
    public class VoidTicketsRequestTest
    {
        private NetPositionService netPositionService;
        private HandleService handleService;
        private LoggingService loggingService;
        private ResultCacheService resultCacheService;
        private CashOutApiService cashOutApiService;
        private AfterVoidService afterVoidService;

        private VoidTicketsHandler CreateHandler()
        {
            netPositionService = Substitute.For<NetPositionService>();
            handleService = Substitute.For<HandleService>();
            loggingService = Substitute.For<LoggingService>();
            cashOutApiService = Substitute.For<CashOutApiService>();
            resultCacheService = Substitute.For<ResultCacheService>();
            afterVoidService = Substitute.For<AfterVoidService>();
            return new VoidTicketsHandler(
                netPositionService,
                handleService,
                loggingService,
                resultCacheService,
                cashOutApiService,
                afterVoidService);
        }

        [Fact]
        public async Task VoidTickets_IsExistResult_ReturnNull()
        {
            // Arrange
            var handler = CreateHandler();
            resultCacheService.IsExistResult("1").ReturnsForAnyArgs(true);
            var tickets = new List<BetId>
            {
                new() { TransId = "123", SiteDbGroupId = 0 },
                new() { TransId = "124", SiteDbGroupId = 1 },
                new() { TransId = "125", SiteDbGroupId = 0 }
            };
            var query = new VoidTicketsRequest
            {
                Tickets = tickets,
                TransIdCrickets = tickets,
                Match = new Match { SportType = 207, HomeId = 1, AwayId = 1 },
                IsFilterByBetId = true,
                Guid = "1"
            };
            handleService.VoidTickets(Arg.Any<VoidTicketsRequest>())
                .ReturnsForAnyArgs(new VoidTicketsModel
                {
                    Validation = new VoidTicketValidation(),
                    Tickets = new List<TicketEmailModel> { new() }
                });

            // Act
            var actual = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.Null(actual);
        }

        [Fact]
        public async Task VoidTickets_HasOnlyCricketTicket_HasErrorExpected()
        {
            // Arrange
            var handler = CreateHandler();
            resultCacheService.IsExistResult("1").ReturnsForAnyArgs(false);
            var tickets = new List<BetId>
            {
                new() { TransId = "123", SiteDbGroupId = 0 }
            };
            var query = new VoidTicketsRequest
            {
                Tickets = tickets,
                TransIdCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } },
                IsFilterByBetId = true
            };
            netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(false);

            // Act
            var actual = await handler.Handle(query, CancellationToken.None);

            // Assert
            AssertExtension.Equal(ErrorCode.ExecuteQueryAPIFail, actual[0].ErrorCode);
        }

        [Fact]
        public async Task VoidTickets_HasVoidTickets_CalledExpected()
        {
            // Arrange
            var handler = CreateHandler();
            resultCacheService.IsExistResult("1").ReturnsForAnyArgs(false);
            var tickets = new List<BetId>
            {
                new() { TransId = "123", SiteDbGroupId = 0 },
                new() { TransId = "124", SiteDbGroupId = 1 },
                new() { TransId = "125", SiteDbGroupId = 0 }
            };
            var ticketEmailModels = new List<TicketEmailModel>
            {
                new() { TransId = 124},
                new() { TransId = 125}
            };

            var query = new VoidTicketsRequest
            {
                Tickets = tickets,
                TransIdCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } },
                IsFilterByBetId = true
            };

            handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
            afterVoidService.SendEmail(Arg.Any<VoidTicketsQuery>(), Arg.Any<IEnumerable<TicketEmailModel>>()).ReturnsForAnyArgs(new List<Result>());
            afterVoidService.SendLetstalk(Arg.Any<VoidTicketsQuery>(), Arg.Any<VoidTicketsModel>()).ReturnsForAnyArgs(new List<Result>());
            netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(false);
            handleService.VoidTickets(Arg.Any<VoidTicketsQuery>()).ReturnsForAnyArgs(new VoidTicketsModel
            {
                Tickets = ticketEmailModels,
                Validation = new VoidTicketValidation { ErrorCode = 1, ErrorMsg = "a" }
            });

            // Act
            _ = await handler.Handle(query, CancellationToken.None);

            // Assert
            handleService.Received(1).CreateWarningMessage(Arg.Any<string>());
            await afterVoidService.Received(1).SendMessage(Arg.Any<VoidTicketsQuery>(), Arg.Any<IEnumerable<TicketEmailModel>>());
            await afterVoidService.Received(1).SendEmail(Arg.Any<VoidTicketsQuery>(), Arg.Any<IEnumerable<TicketEmailModel>>());
            await afterVoidService.Received(1).SendLetstalk(Arg.Any<VoidTicketsQuery>(), Arg.Any<VoidTicketsModel>());
            await cashOutApiService.Received(1).VoidBetForCashOutBasketball(Arg.Any<IEnumerable<TicketEmailModel>>());
            await netPositionService.Received(1).RollBackNetPosition(Arg.Any<IEnumerable<BetId>>());
        }

        //[Fact]
        //public async Task VoidTickets_SendLetstalkHasMatchIsNull_ReturnExpectedResults()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123", SiteDbGroupId = 0 },
        //        new() { TransId = "124", SiteDbGroupId = 1 },
        //        new() { TransId = "125", SiteDbGroupId = 0 }
        //    };
        //    var voidedTickets = new List<TicketEmailModel>
        //    {
        //        new() { BetTypeId = 29, ParentMatchId = 100 },
        //        new() { BetTypeId = 10, ParentMatchId = 100 },
        //        new() { BetTypeId = 2, ParentMatchId = 100 }
        //    };
        //    var query = new VoidTicketsRequest
        //    {
        //        Tickets = tickets,
        //        TransIdCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } },
        //        IsFilterByBetId = true,
        //        Match = null
        //    };
        //    handleService.VoidTickets(Arg.Any<VoidTicketsRequest>())
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = voidedTickets
        //        });
        //    var results = new List<Result> { new() };
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(results);
        //    handleService.SendEmail(Arg.Any<VoidTicketsQuery>(), Arg.Any<List<TicketEmailModel>>())
        //        .ReturnsForAnyArgs(results);
        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(false);
        //    notificationLetstalkService
        //        .SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>())
        //        .ReturnsForAnyArgs(results);
        //    var expectedResults = new List<Result> { new(), new() };

        //    // Act
        //    var actual = await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    AssertExtension.Equal(expectedResults, actual);
        //}

        //[Fact]
        //public async Task VoidTickets_SendLetstalkHasNormalTickets_ExpectedReceived()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123", SiteDbGroupId = 0 },
        //        new() { TransId = "124", SiteDbGroupId = 1 },
        //        new() { TransId = "125", SiteDbGroupId = 0 }
        //    };
        //    var query = new VoidTicketsRequest
        //    {
        //        Tickets = tickets,
        //        TransIdCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } },
        //        IsFilterByBetId = true,
        //        Match = null
        //    };
        //    handleService.VoidTickets(Arg.Any<VoidTicketsRequest>())
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = new List<TicketEmailModel>
        //            {
        //                new() { BetTypeId = BetTypeConstant.Outright, ParentMatchId = 1 },
        //                new() { BetTypeId = 1, ParentMatchId = 1 },
        //                new() { BetTypeId = 1231, OddsId = 1 }
        //            }
        //        });
        //    var results = new List<Result> { new() };
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(results);
        //    handleService.SendEmail(Arg.Any<VoidTicketsQuery>(), Arg.Any<List<TicketEmailModel>>())
        //        .ReturnsForAnyArgs(results);
        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(false);
        //    notificationLetstalkService
        //        .SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<IEnumerable<TicketEmailModel>>())
        //        .ReturnsForAnyArgs(results);
        //    handleService.GetMatchInfo(Arg.Any<int>(), Arg.Any<int>()).ReturnsForAnyArgs(new Match());

        //    // Act
        //    _ = await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await handleService.Received(2).GetMatchInfo(Arg.Any<int>(), Arg.Any<int>());
        //    await notificationLetstalkService.Received(2)
        //        .SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(), Arg.Any<List<TicketEmailModel>>());
        //}

        //[Fact]
        //public async Task VoidTickets_FailUpdateNetPositionAndTransIdsIsTransIdCrickets_DisplayErrorMessageCricket()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var expectedResult = new Result
        //    {
        //        ErrorCode = ErrorCode.ExecuteQueryAPIFail,
        //        ErrorMsg = "Error Update Net Position Cricket"
        //    };
        //    var ticketEmails = new List<TicketEmailModel>
        //    {
        //        new() { BetTypeId = 1 },
        //        new() { BetTypeId = 1231 }
        //    };
        //    var voidTicketsModel = new VoidTicketsModel
        //    {
        //        Validation = new VoidTicketValidation(),
        //        Tickets = ticketEmails
        //    };
        //    var query = new VoidTicketsRequest
        //    {
        //        Tickets = tickets,
        //        TransIdCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } }
        //    };
        //    netPositionService
        //        .UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(false);
        //    handleService.CreateWarningMessage(Arg.Any<string>())
        //        .ReturnsForAnyArgs(new List<Result> { expectedResult });
        //    handleService.VoidTickets(Arg.Any<VoidTicketsQuery>()).ReturnsForAnyArgs(voidTicketsModel);
        //    handleService.SendEmail(query, new List<TicketEmailModel>()).ReturnsForAnyArgs(new List<Result>());

        //    // Act
        //    var actual = await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    AssertExtension.Equal(expectedResult, actual[0]);
        //}

        //[Fact]
        //public async Task VoidTickets_HandleServiceReturnErrorCode_DisplayErrorMessage()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var expectedResult = new Result
        //    {
        //        ErrorCode = 1,
        //        ErrorMsg = "Store procedure return error message"
        //    };
        //    var validation = new VoidTicketValidation
        //    {
        //        ErrorCode = expectedResult.ErrorCode,
        //        ErrorMsg = expectedResult.ErrorMsg
        //    };
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var query = new VoidTicketsRequest { Tickets = tickets };
        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.VoidTickets(Arg.Any<VoidTicketsRequest>())
        //        .ReturnsForAnyArgs(new VoidTicketsModel { Validation = validation });

        //    // Act
        //    var actual = await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    AssertExtension.Equal(expectedResult, actual[0]);
        //}

        //[Fact]
        //public async Task VoidTickets_HaveErrorCode_RollBackNetPosition()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    const string errorMsg = "Store procedure return error message";
        //    var validation = new VoidTicketValidation
        //    {
        //        ErrorCode = 1,
        //        ErrorMsg = errorMsg
        //    };
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var transIdCrickets = new List<BetId> { new() { TransId = "123", SiteDbGroupId = 0 } };
        //    var query = new VoidTicketsRequest { Tickets = tickets, TransIdCrickets = transIdCrickets };
        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.VoidTickets(Arg.Any<VoidTicketsRequest>())
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = validation
        //        });

        //    // Act
        //    await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await netPositionService.Received().RollBackNetPosition(Arg.Any<IEnumerable<BetId>>());
        //}

        //[Fact]
        //public async Task VoidTickets_NoTicket_DidNotCallInsertMessage()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var query = new VoidTicketsRequest { Tickets = tickets };
        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), Arg.Any<string>())
        //        .ReturnsForAnyArgs(true);
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        //    handleService.VoidTickets(query).ReturnsForAnyArgs(new VoidTicketsModel
        //    {
        //        Validation = new VoidTicketValidation()
        //    });
        //    await voidResultCacheService.SetVoidResultsCache(Arg.Any<string>(), Arg.Any<List<Result>>());

        //    // Act
        //    await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await handleService
        //        .DidNotReceive()
        //        .SendMessage(Arg.Any<VoidTicketsQuery>(), Arg.Any<List<TicketEmailModel>>());
        //}

        //[Fact]
        //public async Task VoidTickets_InValidTickets_DidNotSendMessage()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var query = new VoidTicketsRequest { Tickets = tickets };
        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        //    handleService.VoidTickets(query)
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = new List<TicketEmailModel>()
        //        });
        //    await voidResultCacheService.SetVoidResultsCache(Arg.Any<string>(), Arg.Any<List<Result>>());

        //    // Act
        //    await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await handleService
        //        .DidNotReceive()
        //        .SendMessage(Arg.Any<VoidTicketsQuery>(), Arg.Any<List<TicketEmailModel>>());
        //}

        //[Fact]
        //public async Task VoidTickets_ValidTickets_CallServiceApi()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var query = new VoidTicketsRequest { Tickets = tickets };
        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        //    handleService.SendEmail(Arg.Any<VoidTicketsRequest>(), Arg.Any<List<TicketEmailModel>>())
        //        .ReturnsForAnyArgs(new List<Result>());
        //    handleService.VoidTickets(query)
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = new List<TicketEmailModel> { new() }
        //        });

        //    // Act
        //    await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await netPositionService.Received().UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID");
        //}

        //[Fact]
        //public async Task VoidTickets_InsertMessageWasException_WriteLogException()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var expectedException = new Exception("Insert message was error!");
        //    var query = new VoidTicketsRequest { Tickets = tickets };
        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        //    handleService.VoidTickets(query)
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = new List<TicketEmailModel> { new() }
        //        });
        //    handleService.When(x =>
        //            x.SendMessage(Arg.Any<VoidTicketsQuery>(), Arg.Any<List<TicketEmailModel>>()))
        //        .Do(e => throw expectedException);

        //    // Act
        //    await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await loggingService.Received().ErrorAsync(Arg.Is<Exception>(x => expectedException.Message == x.Message));
        //}

        //[Fact]
        //public async Task VoidTickets_SendEmailWasException_DisplayMessageException()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    const string expectedMessage = "Send email was error!";
        //    var exception = new Exception(expectedMessage);
        //    var query = new VoidTicketsRequest { Tickets = tickets };

        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.VoidTickets(query)
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = new List<TicketEmailModel> { new() }
        //        });
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        //    handleService.When(x =>
        //            x.SendEmail(Arg.Any<VoidTicketsRequest>(), Arg.Any<List<TicketEmailModel>>()))
        //        .Do(e => throw exception);
        //    await voidResultCacheService.SetVoidResultsCache(Arg.Any<string>(), Arg.Any<List<Result>>());

        //    // Act
        //    var actual = await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    Assert.Equal(expectedMessage, actual[0].ErrorMsg);
        //}

        //[Fact]
        //public async Task VoidTickets_IsNotExistVoidResult_ReturnNull()
        //{
        //    // Arrange
        //    var query = new VoidTicketsRequest();
        //    var resultCacheService = Substitute.For<ResultCacheService>();
        //    resultCacheService.IsExistResult("").ReturnsForAnyArgs(true);
        //    var handler = new VoidTicketsHandler(null, null, null, null, null, resultCacheService, null);

        //    // Act
        //    var actual = await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    Assert.Null(actual);
        //}

        //[Fact]
        //public async Task VoidTickets_HaveNotAnyTicket_ReturnResultWithError()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var query = new VoidTicketsRequest
        //    {
        //        Tickets = new List<BetId>(),
        //        TransIdCrickets = new List<BetId> { new() { TransId = "123" } }
        //    };
        //    handleService.VoidTickets(Arg.Any<VoidTicketsRequest>())
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation()
        //        });

        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(false);

        //    // Act
        //    var actual = await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    Assert.True(actual.Any(x => x.ErrorCode == ErrorCode.ExecuteQueryAPIFail));
        //}

        //[Fact]
        //public async Task VoidTickets_IsFilterByBetIdAndHasMatch_SendLetstalk()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var query = new VoidTicketsRequest
        //    {
        //        Tickets = tickets,
        //        IsFilterByBetId = true,
        //        Match = new Match()
        //    };

        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.VoidTickets(query)
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = new List<TicketEmailModel> { new() }
        //        });
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        //    handleService.SendEmail(Arg.Any<VoidTicketsRequest>(), Arg.Any<List<TicketEmailModel>>())
        //        .ReturnsForAnyArgs(new List<Result>());
        //    notificationLetstalkService.SendToGroupVoidSettledBets(new TicketInfoForLetstalk(), new List<TicketEmailModel>()).ReturnsForAnyArgs(new List<Result>());

        //    // Act
        //    await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await notificationLetstalkService.Received(1).SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(),
        //        Arg.Any<IEnumerable<TicketEmailModel>>());
        //}

        //[Fact]
        //public async Task VoidTickets_IsFilterByBetIdAndHasNotMatch_SendLetstalk()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var query = new VoidTicketsRequest
        //    {
        //        Tickets = tickets,
        //        IsFilterByBetId = true,
        //        Match = null
        //    };
        //    var ticketEmails = new List<TicketEmailModel>
        //    {
        //        new() { BetTypeId = 1, MatchId = 112, OddsId = 1, ParentMatchId = 112 },
        //        new() { BetTypeId = 2, MatchId = 112, OddsId = 1, ParentMatchId = 112 },
        //        new() { BetTypeId = 1231, MatchId = 112, OddsId = 1, ParentMatchId = 112 },
        //        new() { BetTypeId = 1232, MatchId = 112, OddsId = 1, ParentMatchId = 112 }
        //    };

        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.VoidTickets(query)
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = ticketEmails
        //        });
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        //    handleService.SendEmail(Arg.Any<VoidTicketsRequest>(), Arg.Any<List<TicketEmailModel>>())
        //        .ReturnsForAnyArgs(new List<Result>());
        //    handleService.GetMatchInfo(Arg.Any<int>(), Arg.Any<int>()).ReturnsForAnyArgs(new Match());
        //    notificationLetstalkService.SendToGroupVoidSettledBets(new TicketInfoForLetstalk(), new List<TicketEmailModel>()).ReturnsForAnyArgs(new List<Result>());

        //    // Act
        //    await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await notificationLetstalkService.Received().SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(),
        //        Arg.Any<IEnumerable<TicketEmailModel>>());
        //}

        //[Fact]
        //public async Task VoidTickets_AllTicketsIsParlay_DoNotSendLetstalk()
        //{
        //    // Arrange
        //    var handler = CreateHandler();
        //    var tickets = new List<BetId>
        //    {
        //        new() { TransId = "123" },
        //        new() { TransId = "124" },
        //        new() { TransId = "125" }
        //    };
        //    var query = new VoidTicketsRequest
        //    {
        //        Tickets = tickets,
        //        IsFilterByBetId = true,
        //        Match = null
        //    };
        //    var ticketEmails = new List<TicketEmailModel>
        //    {
        //        new() { BetTypeId = 29, MatchId = 112, OddsId = 1 },
        //        new() { BetTypeId = 29, MatchId = 112, OddsId = 1 },
        //        new() { BetTypeId = 29, MatchId = 112, OddsId = 1 },
        //        new() { BetTypeId = 29, MatchId = 112, OddsId = 1 }
        //    };

        //    netPositionService.UpdateNetPosition(Arg.Any<IEnumerable<BetId>>(), "VOID").ReturnsForAnyArgs(true);
        //    handleService.VoidTickets(query)
        //        .ReturnsForAnyArgs(new VoidTicketsModel
        //        {
        //            Validation = new VoidTicketValidation(),
        //            Tickets = ticketEmails
        //        });
        //    handleService.CreateWarningMessage(Arg.Any<string>()).ReturnsForAnyArgs(new List<Result>());
        //    handleService.SendEmail(Arg.Any<VoidTicketsRequest>(), Arg.Any<List<TicketEmailModel>>())
        //        .ReturnsForAnyArgs(new List<Result>());
        //    handleService.GetMatchInfo(Arg.Any<int>(), Arg.Any<int>()).ReturnsForAnyArgs(new Match());
        //    notificationLetstalkService.SendToGroupVoidSettledBets(new TicketInfoForLetstalk(), new List<TicketEmailModel>()).ReturnsForAnyArgs(new List<Result>());

        //    // Act
        //    await handler.Handle(query, CancellationToken.None);

        //    // Assert
        //    await notificationLetstalkService.Received(0).SendToGroupVoidSettledBets(Arg.Any<TicketInfoForLetstalk>(),
        //        Arg.Any<IEnumerable<TicketEmailModel>>());
        //}
    }
}