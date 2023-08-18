using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Criteria.SendEmail;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.Models.SendMessage;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.SendEmail;
using TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.SendEmail.VoidDuplicateTickets;

public class SendEmailDuplicateTicketsServiceTests
{
    private readonly DuplicateTicketsEmailItQaService emailItQaService;
    private readonly DuplicateTicketsEmailItSupportService emailItSupportService;
    private readonly DuplicateTicketsEmailLicenseeService emailLicenseeService;
    private readonly RemotingRefWrapperService remotingRefWrapperService;
    private readonly IDynamicRepository repository;
    private readonly SendEmailDuplicateTicketsServiceImp service;
    private readonly SitesEmailService sitesEmailService;

    public SendEmailDuplicateTicketsServiceTests()
    {
        sitesEmailService = Substitute.For<SitesEmailService>();
        emailLicenseeService = Substitute.For<DuplicateTicketsEmailLicenseeService>();
        emailItQaService = Substitute.For<DuplicateTicketsEmailItQaService>();
        emailItSupportService = Substitute.For<DuplicateTicketsEmailItSupportService>();
        repository = Substitute.For<IDynamicRepository>();
        remotingRefWrapperService = Substitute.For<RemotingRefWrapperService>();
        service = new SendEmailDuplicateTicketsServiceImp(sitesEmailService, emailLicenseeService, emailItQaService,
            emailItSupportService, repository, remotingRefWrapperService);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(0)]
    public async Task SendEmail_ValidData_ReturnExpected(int sportType)
    {
        // Arrange
        var model = new EmailVoidModel
            { RequestId = 1, VoidingHistoryId = 1, IssueTypeId = 1, SportType = sportType, Message = new Message() };
        var duplicateTickets = new List<DuplicateTicketsRequestInfo>();
        repository.FetchAsync<DuplicateTicketsRequestInfo>(Arg.Any<DuplicateTicketsRequestInfoCriteria>())
            .ReturnsForAnyArgs(duplicateTickets);
        var sites = new List<SiteEmail> { new() };
        var results = new List<Result> { new() };
        sitesEmailService.GetSitesByCategory(model.IssueTypeId).ReturnsForAnyArgs(sites);
        remotingRefWrapperService.GetSportName("1", LanguageCode.English).ReturnsForAnyArgs("123");
        remotingRefWrapperService.GetSportName("1", LanguageCode.ChineseSimplified).ReturnsForAnyArgs("456");
        emailLicenseeService.Send(Arg.Any<DuplicateTicketsMailVoidViewModel>(), sites, duplicateTickets)
            .ReturnsForAnyArgs(results);

        // Act
        var actual = await service.SendEmail(model);

        // Assert
        await emailItQaService.Received(1).Send(Arg.Any<DuplicateTicketsMailVoidViewModel>(), sites, duplicateTickets);
        await emailItSupportService.Received(1).Send(Arg.Any<DuplicateTicketsMailVoidViewModel>(), sites, duplicateTickets);
        AssertExtension.Equal(results, actual);
    }
}