using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using NSubstitute;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Repositories;
using SpecialDelete.VoidByBetId.Services.VoidTickets;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendMessage;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Services.VoidTickets
{
    [Category("VoidByBetId")]
    public class HandleServiceTest
    {
        private static HandleServiceImp CreateService(VoidByBetIdRepository repository)
        {
            var mapper = Substitute.For<IMapper>();
            var sessionService = Substitute.For<SessionService>();
            var messageService = Substitute.For<SendMessageService>();
            var loggingService = Substitute.For<LoggingService>();
            var emailService = Substitute.For<SendEmailService>();
            var matchService = Substitute.For<MatchService>();

            mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());

            return new HandleServiceImp(mapper, sessionService, repository,
                messageService, loggingService, emailService, matchService);
        }

        [Fact]
        public async Task ExecuteQuery_HasCriteria_ReturnVoidTicketsFromRepository()
        {
            // Arrange
            var expected = new VoidTicketsModel
            {
                Tickets = new List<TicketEmailModel>()
            };
            var query = new VoidTicketsQuery { Password = "Test", SubIssueTypeName = "", SubIssueTypeNameCS = "" };
            var repository = Substitute.For<VoidByBetIdRepository>();
            repository
                .VoidTickets(Arg.Any<VoidTicketsQuery>())
                .ReturnsForAnyArgs(expected);
            var service = CreateService(repository);

            // Act
            var actual = await service.VoidTickets(query);

            // Assert
            AssertExtension.Equal(expected, actual);
        }

        [Fact]
        public async Task ExecuteQuery_RepositoryThrowException_UpdateOutputParam()
        {
            // Arrange
            var exception = new Exception("Error Void Tickets");
            var validation = new VoidTicketValidation
            {
                ErrorCode = ErrorCode.ExecuteQueryFail,
                ErrorMsg = exception.Message
            };
            var expected = new VoidTicketsModel { Validation = validation };
            var query = new VoidTicketsQuery { Password = "Test" };
            var repository = Substitute.For<VoidByBetIdRepository>();
            repository
                .When(x => x.VoidTickets(Arg.Any<VoidTicketsQuery>()))
                .Do(y => throw exception);
            var service = CreateService(repository);

            // Act
            var actual = await service.VoidTickets(query);

            // Assert
            AssertExtension.Equal(expected, actual);
        }

        private static HandleServiceImp CreateService(VoidByBetIdRepository repository, LoggingService loggingService)
        {
            var mapper = Substitute.For<IMapper>();
            var sessionService = Substitute.For<SessionService>();
            var messageService = Substitute.For<SendMessageService>();
            var emailService = Substitute.For<SendEmailService>();
            var matchService = Substitute.For<MatchService>();
            mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());

            return new HandleServiceImp(mapper, sessionService, repository, messageService,
                loggingService, emailService, matchService);
        }

        [Fact]
        public async Task ExecuteQuery_RepositoryThrowException_WriteLog()
        {
            // Arrange
            var exception = new Exception("Error Void Tickets");
            var query = new VoidTicketsQuery { Password = "Test" };
            var repository = Substitute.For<VoidByBetIdRepository>();
            var loggingService = Substitute.For<LoggingService>();
            repository
                .When(x => x.VoidTickets(Arg.Any<VoidTicketsQuery>()))
                .Do(y => throw exception);
            var service = CreateService(repository, loggingService);

            // Act
            await service.VoidTickets(query);

            // Assert
            await loggingService.Received().ErrorAsync(Arg.Is<Exception>(x => x.Message == exception.Message));
        }

        private static HandleServiceImp CreateService()
        {
            var mapper = Substitute.For<IMapper>();
            var sessionService = Substitute.For<SessionService>();
            var repository = Substitute.For<VoidByBetIdRepository>();
            var messageService = Substitute.For<SendMessageService>();
            var loggingService = Substitute.For<LoggingService>();
            var emailService = Substitute.For<SendEmailService>();
            var matchService = Substitute.For<MatchService>();
            mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());

            return new HandleServiceImp(mapper, sessionService, repository, messageService,
                loggingService, emailService, matchService);
        }

        [Fact]
        public void CreateWarningMessage_ExistInvalidTrans_ReturnInvalidTransResult()
        {
            // Arrange
            var service = CreateService();

            // Act
            var actual = service.CreateWarningMessage(string.Empty);

            // Assert
            Assert.Empty(actual);
        }

        [Fact]
        public void CreateWarningMessage_ExistWarningCricket_ReturnInvalidTransResult()
        {
            // Arrange
            const string warningCricket = "Fail to update NetPosition Cricket Tickets!";
            var result = new Result
            {
                ErrorCode = ErrorCode.ExecuteQueryAPIFail,
                ErrorMsg = warningCricket
            };
            var expected = new List<Result> { result };
            var service = CreateService();

            // Act
            var actual = service.CreateWarningMessage(warningCricket);

            // Assert
            AssertExtension.Equal(expected, actual);
        }

        private static HandleServiceImp CreateService(SendMessageService messageService)
        {
            var sessionService = Substitute.For<SessionService>();
            var mapper = Substitute.For<IMapper>();
            var repository = Substitute.For<VoidByBetIdRepository>();
            var loggingService = Substitute.For<LoggingService>();
            var emailService = Substitute.For<SendEmailService>();
            var matchService = Substitute.For<MatchService>();
            mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());

            return new HandleServiceImp(mapper, sessionService, repository, messageService,
                loggingService, emailService, matchService);
        }

        [Fact]
        public async Task SendMessage_IsAbnormalBet_CallExpectedApiFromMessageService()
        {
            // Arrange
            var tickets = new List<TicketEmailModel> { new() { TransId = 1, CustId = 1, MatchId = 1 } };
            var query = new VoidTicketsQuery
            {
                Message = new Message { ContentEnglish = "Content english" },
                Reason = "Soccer - Early Kick Off",
                ReasonSC = "足球 - 由于赛事时间提前开始",
                StatusIds = "0",
                IssueTypeId = 11,
                IsFilterByBetId = true,
                Match = new Match()
            };
            const int reasonId = 111;
            const int messageId = 123;
            var messageService = Substitute.For<SendMessageService>();
            messageService.InsertReason(query.Reason, query.ReasonSC).Returns(Task.FromResult(reasonId));
            messageService.InsertMessage(query.Message, 0, query.Match?.LeagueGroupId, query.IsAbnormalBet).Returns(Task.FromResult(messageId));
            var service = CreateService(messageService);

            // Act
            await service.SendMessage(query, tickets);

            // Assert
            await messageService.Received(1).InsertMessageIntoAdminSite(Arg.Any<Message>());
            await messageService.Received(1)
                .InsertVoidedTransaction(Arg.Any<IEnumerable<TicketEmailModel>>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<int>());
        }

        [Fact]
        public async Task SendMessage_IsDangerAccepted_CallExpectedApiFromMessageService()
        {
            // Arrange
            var tickets = new List<TicketEmailModel> { new() { TransId = 1, CustId = 1, MatchId = 1 } };
            var query = new VoidTicketsQuery
            {
                Message = new Message { ContentEnglish = "Content english" },
                Reason = "Soccer - Early Kick Off",
                ReasonSC = "足球 - 由于赛事时间提前开始",
                StatusIds = "0",
                IssueTypeId = 1,
                IsFilterByBetId = true,
                Match = new Match()
            };
            const int reasonId = 111;
            const int messageId = 123;
            var messageService = Substitute.For<SendMessageService>();
            messageService.InsertReason(query.Reason, query.ReasonSC).Returns(Task.FromResult(reasonId));
            messageService.InsertMessage(query.Message, 0, query.Match?.LeagueGroupId, query.IsAbnormalBet).ReturnsForAnyArgs(Task.FromResult(messageId));
            var service = CreateService(messageService);

            // Act
            await service.SendMessage(query, tickets);

            // Assert
            await messageService.Received(1)
                .InsertMessageIntoAdminSite(Arg.Any<Message>());
            await messageService.Received(1)
                .InsertVoidedTransaction(Arg.Any<IEnumerable<TicketEmailModel>>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<int>());
        }

        private static HandleServiceImp CreateService(SendEmailService emailService)
        {
            var sessionService = Substitute.For<SessionService>();
            var mapper = Substitute.For<IMapper>();
            var repository = Substitute.For<VoidByBetIdRepository>();
            var messageService = Substitute.For<SendMessageService>();
            var loggingService = Substitute.For<LoggingService>();
            var matchService = Substitute.For<MatchService>();
            mapper.Map<EmailVoidModel>(null).ReturnsForAnyArgs(new EmailVoidModel());

            return new HandleServiceImp(mapper, sessionService, repository, messageService,
                loggingService, emailService, matchService);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(11)]
        public async Task SendEmail_Successful_ReturnSendEmailResults(int issueTypeId)
        {
            // Arrange
            var query = new VoidTicketsQuery { IssueTypeId = issueTypeId, IsAbnormalBet = true };
            var tickets = new List<TicketEmailModel> { new() };
            var expected = new List<Result> { new() { ErrorMsg = "Void Bets Successful!" } };
            var emailService = Substitute.For<SendEmailService>();
            emailService.SendEmail(Arg.Any<EmailVoidModel>(), tickets)
                .Returns(expected);
            var service = CreateService(emailService);

            // Act
            var results = await service.SendEmail(query, tickets);

            // Assert
            AssertExtension.Equal(expected, results);
        }

        [Fact]
        public async Task GetMatchInfo_Successful_ReturnMatchModel()
        {
            // Arrange
            var expected = new Match();
            var matchService = Substitute.For<MatchService>();
            matchService.GetMatch(new GetMatchInfoCriteria()).ReturnsForAnyArgs(expected);
            matchService.UpdateMatchInfoFromRemotingRef(null).ReturnsForAnyArgs(expected);
            var service = new HandleServiceImp(null, null, null, null, null, null, matchService);

            // Act
            var results = await service.GetMatchInfo(1, 1);

            // Assert
            AssertExtension.Equal(expected, results);
        }
    }
}