using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Nodes;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.SharedApi.Criteria.MessageTemplate;
using TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;
using TicketVoidingSystem.SharedApi.Models.MessageTemplate;
using TicketVoidingSystem.SharedApi.ViewModels.MessageTemplate;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.MessageTemplate;

public class GetTemplateSettingHandlerTests
{
    private readonly GetTemplateSettingHandler handler;
    private readonly IMapper mapper;
    private readonly IDynamicRepository repository;

    public GetTemplateSettingHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        mapper = Substitute.For<IMapper>();
        handler = new GetTemplateSettingHandler(repository, mapper);
    }

    [Fact]
    public async Task Handle_Returns_TemplateSettingViewModel()
    {
        // Arrange
        var request = new GetTemplateSettingRequest();
        var templateModels = new List<TemplateModel> { new() };
        var templateSettings = new List<TemplateSetting> { new() };
        var expectedViewModel = new TemplateSettingViewModel
        {
            MessageTemplates = new List<MessageTemplateViewModel>
            {
                new()
                {
                    InputTexts = new List<InputText>()
                }
            },
            TemplateSettings = templateSettings
        };

        repository.FetchAsync<TemplateModel>(Arg.Any<GetTemplatesCriteria>(), Arg.Any<CancellationToken>())
            .Returns(templateModels);

        repository.FetchAsync<TemplateSetting>(Arg.Any<GetTemplateSettingCriteria>(), Arg.Any<CancellationToken>())
            .Returns(templateSettings);

        mapper.Map<MessageTemplateViewModel>(Arg.Any<TemplateModel>())
            .Returns(new MessageTemplateViewModel());

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(expectedViewModel.MessageTemplates.ToList().Count, result.MessageTemplates.ToList().Count);
        Assert.Equal(expectedViewModel.TemplateSettings.ToList().Count, result.TemplateSettings.ToList().Count);
    }
}