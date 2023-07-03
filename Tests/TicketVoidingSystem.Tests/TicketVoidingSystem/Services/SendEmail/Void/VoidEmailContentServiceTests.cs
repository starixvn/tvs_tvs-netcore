using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.Void;
using Xunit;
using TicketVoidingSystem.Services.SendEmail.Subject;
using TicketVoidingSystem.Services.SendEmail;
using System.Collections.Generic;
using Fanex.MailDeliver.Model;
using TicketVoidingSystem.Criteria.SendEmail;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.Void
{
    public class VoidEmailContentServiceTests
    {
        private readonly TicketService ticketService;
        private readonly SubjectService subjectService;
        private readonly TemplateEmailService templateEmailService;
        private readonly IDynamicRepository repository;
        private readonly VoidEmailContentServiceImp service;

        public VoidEmailContentServiceTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            ticketService = Substitute.For<TicketService>();
            subjectService = Substitute.For<SubjectService>();
            templateEmailService = Substitute.For<TemplateEmailService>();
            service = new VoidEmailContentServiceImp(repository, ticketService, subjectService, templateEmailService);
        }

        [Fact]
        public async void Create_HasNoValidTicket_ReturnNewMailRecord()
        {
            // Arrange
            var tickets = new List<TicketEmailModel>();
            var site = new SiteEmail();
            var expected = new MailRecord();

            // Act
            var actual = await service.Create(null, site, tickets, EmailGroup.CashOut, true);

            // Assert
            AssertExtension.Equal(expected, actual);
        }

        [Theory]
        [InlineData(true, false, false, VoidType.Abnormal)]
        [InlineData(false, true, false, VoidType.Abnormal)]
        [InlineData(false, false, true, VoidType.Abnormal)]
        [InlineData(false, false, false, VoidType.None)]
        public async void Create_HasValidTicketAndSite_ReturnExpectedMailRecord(bool isLikelyAbnormalBet, bool isAbnormalAccount, bool isFilterByUserName, VoidType voidType)
        {
            // Arrange
            var tickets = new List<TicketEmailModel>{new TicketEmailModel{ Recommend  = 1} };
            var site = new SiteEmail{ ToList ="1;2;3"};
            var mailRecordResult = new MailRecordResult
            {
                SiteEmail = new SiteEmail
                {
                    ToList = "1;2;3",
                    CcList = "CcList",
                    BccList = "BccList"
                },
                Subject = "Subject",
                EmailBody = "EmailBody"
            };
            var mailVoidViewModel = new MailVoidViewModel
            {
                IsLikelyAbnormalBet = isLikelyAbnormalBet,
                IsAbnormalAccount = isAbnormalAccount,
                IsFilterByUserName = isFilterByUserName
            };
            repository.FetchAsync<GetOperatorInfoModel>(Arg.Any<GetOperatorInfoCriteria>())
                .ReturnsForAnyArgs(new List<GetOperatorInfoModel>{new GetOperatorInfoModel{ AgentId  = 1, OperatorID = "11"} });
            ticketService.GetTicket(Arg.Any<TicketEmailModel>(), Arg.Any<Match>(), site, true)
                .ReturnsForAnyArgs(new TicketEmailViewModel());
            subjectService.CreateVoid(Arg.Any<MailVoidViewModel>(), Arg.Any<IEnumerable<TicketEmailModel>>(),
                    Arg.Any<SiteEmail>(), Arg.Any<EmailGroup>(), Arg.Any<VoidType>()).ReturnsForAnyArgs("subject");
            templateEmailService.Create(Arg.Any<MailVoidViewModel>(), Arg.Any<IEnumerable<TicketEmailViewModel>>(),
                    Arg.Any<SiteEmail>(), "subject")
                .ReturnsForAnyArgs(mailRecordResult);

            // Act
            var actual = await service.Create(mailVoidViewModel, site, tickets, EmailGroup.CashOut, true);

            // Assert
            AssertExtension.Equal(mailRecordResult.MailRecord, actual);
            subjectService.Received(1).CreateVoid(Arg.Any<MailVoidViewModel>(), Arg.Any<IEnumerable<TicketEmailModel>>(),
                Arg.Any<SiteEmail>(), Arg.Any<EmailGroup>(), voidType);
        }
    }
}
