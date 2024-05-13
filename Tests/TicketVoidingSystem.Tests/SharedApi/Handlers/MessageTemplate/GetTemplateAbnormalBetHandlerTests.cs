using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.MessageTemplate;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;
using TicketVoidingSystem.SharedApi.Models.MessageTemplate;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.MessageTemplate;

public class GetTemplateAbnormalBetHandlerTests
{
    private readonly IDynamicRepository repository = Substitute.For<IDynamicRepository>();
    private GetTemplateAbnormalBetHandler handler;

    [Fact]
    public async Task Handle_HasRequest_HasCalledExpected()
    {
        // Arrange
        handler = new GetTemplateAbnormalBetHandler(repository);
        var cancellationToken = CancellationToken.None;
        repository.FetchAsync<SubIssueType>(new GetSubIssueTypeCriteria(), cancellationToken)
            .Returns(new List<SubIssueType>());
        repository.FetchAsync<TemplateSetting>(new GetTemplateSettingCriteria(), cancellationToken)
            .Returns(new List<TemplateSetting>());
        repository.FetchAsync<TemplateModel>(new GetTemplatesCriteria(), cancellationToken)
            .Returns(new List<TemplateModel>());

        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        await repository.Received(1).FetchAsync<SubIssueType>(Arg.Any<GetSubIssueTypeCriteria>());
        await repository.Received(1)
            .FetchAsync<TemplateSetting>(Arg.Any<GetTemplateSettingCriteria>());
        await repository.Received(1).FetchAsync<TemplateModel>(Arg.Any<GetTemplatesCriteria>());
    }
}