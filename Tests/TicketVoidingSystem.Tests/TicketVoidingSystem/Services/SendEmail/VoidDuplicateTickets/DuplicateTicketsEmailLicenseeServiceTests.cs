using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Force.DeepCloner;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;
using TicketVoidingSystem.Services.SendEmail;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Services;
using Xunit;
using System.Security.Policy;
using Fanex.MailDeliver.Model;
using Microsoft.VisualStudio.TestPlatform.CommunicationUtilities;
using NSubstitute.ExceptionExtensions;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets
{
    public class DuplicateTicketsEmailLicenseeServiceTests
    {
        private readonly DuplicateTicketsEmailContentService emailContentService;
        private readonly FanexMailApiService fanexMailApiService;
        private readonly MailResultService mailResultService;
        private readonly ChinaViewMessageService chinaViewMessageService;
        private readonly DuplicateTicketsEmailLicenseeServiceImp service;
        public DuplicateTicketsEmailLicenseeServiceTests()
        {
            emailContentService = Substitute.For<DuplicateTicketsEmailContentService>();
            fanexMailApiService = Substitute.For<FanexMailApiService>();
            mailResultService = Substitute.For<MailResultService>();
            chinaViewMessageService = Substitute.For<ChinaViewMessageService>();
            service = new DuplicateTicketsEmailLicenseeServiceImp(emailContentService, fanexMailApiService, mailResultService,
                chinaViewMessageService);
        }

        [Fact]
        public async Task Send_HasSite_ReturnExpected()
        {
            // Arrange
            var mailLicenseesModel = new DuplicateTicketsMailVoidViewModel();
            var duplicateTickets = new List<DuplicateTicketsRequestInfo> { new() { EmailGroup = "1" } };
            var sites = new List<SiteEmail> { new() { Site = "1" } };
            var results = new List<Result> { new() };
            mailResultService.CreateFail("1", true).ReturnsForAnyArgs(new Result());
            mailResultService.CreateCombineResults(Arg.Any<CombineMessageModel>(), true).ReturnsForAnyArgs(results);

            // Act
            var actual = await service.Send(mailLicenseesModel, sites, duplicateTickets);

            // Assert
            mailResultService.Received(1).CreateCombineResults(Arg.Any<CombineMessageModel>(), true);
            mailResultService.Received(1).CreateFail("1", true);
            AssertExtension.Equal(results, actual);
        }

        [Fact]
        public async Task Send_HasToList_ReturnExpected()
        {
            // Arrange
            var mailLicenseesModel = new DuplicateTicketsMailVoidViewModel();
            var duplicateTickets = new List<DuplicateTicketsRequestInfo> { new() { EmailGroup = "1" } };
            emailContentService.Create(mailLicenseesModel, Arg.Any<SiteEmail>(), Arg.Any<IEnumerable<DuplicateTicketsRequestInfo>>(), EmailGroup.Csd)
                .ReturnsForAnyArgs(new MailRecord());
            var sites = new List<SiteEmail> { new() { Site = "1", ToList = "1, 2" } };
            var results = new List<Result> { new() };
            mailResultService.CreateCombineResults(Arg.Any<CombineMessageModel>(), true).ReturnsForAnyArgs(results);
            mailResultService.CreateSuccess("1", Arg.Any<string[]>(), true).ReturnsForAnyArgs(new Result());
            // Act
            var actual = await service.Send(mailLicenseesModel, sites, duplicateTickets);

            // Assert
            fanexMailApiService.Received(1).SendEmail(Arg.Any<MailRecord>());
            mailResultService.Received(1).CreateSuccess("1", Arg.Any<string[]>(), true);
            AssertExtension.Equal(results, actual);
        }

        [Fact]
        public async Task Send_HasToListAndException_CalledExpected()
        {
            // Arrange
            var mailLicenseesModel = new DuplicateTicketsMailVoidViewModel();
            var duplicateTickets = new List<DuplicateTicketsRequestInfo> { new() { EmailGroup = "1" } };
            emailContentService.Create(mailLicenseesModel, Arg.Any<SiteEmail>(), Arg.Any<IEnumerable<DuplicateTicketsRequestInfo>>(), EmailGroup.Csd)
                .ReturnsForAnyArgs(new MailRecord());
            var sites = new List<SiteEmail> { new() { Site = "1", ToList = "1, 2" } };
            var results = new List<Result> { new() };
            mailResultService.CreateCombineResults(Arg.Any<CombineMessageModel>(), true).ReturnsForAnyArgs(results);
            mailResultService.CreateSuccess("1", Arg.Any<string[]>(), true).Throws(new Exception());
            mailResultService.CreateFail(Arg.Any<string>(), true).ReturnsForAnyArgs(new Result());
            
            // Act
            var actual = await service.Send(mailLicenseesModel, sites, duplicateTickets);

            // Assert
            mailResultService.Received(1).CreateFail(Arg.Any<string>(), true);
            AssertExtension.Equal(results, actual);
        }
    }
}
