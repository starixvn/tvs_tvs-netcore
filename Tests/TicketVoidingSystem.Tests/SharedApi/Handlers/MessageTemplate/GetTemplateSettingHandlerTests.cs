using System.Collections.Generic;
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
    public async Task Handle_NoHasTemplateModel_ReturnExpected()
    {
        // Arrange
        var request = new GetTemplateSettingRequest();
        var templateModels = new List<TemplateModel> { new() };
        var templateSettings = new List<TemplateSetting> { new() };
        var expectedViewModel = new TemplateSettingViewModel
        {
            MessageTemplates = new List<TemplateModel>
            {
                new()
                {
                    InputTexts = new List<InputText>()
                }
            },
            TemplateSettings = templateSettings
        };

        repository.FetchAsync<TemplateModel>(Arg.Any<GetTemplatesCriteria>()).Returns(templateModels);
        repository.FetchAsync<TemplateSetting>(Arg.Any<GetTemplateSettingCriteria>()).Returns(templateSettings);
        mapper.Map<TemplateModel>(Arg.Any<TemplateModel>()).Returns(new TemplateModel());

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expectedViewModel, result);
    }

    [Fact]
    public async Task Handle_HasTemplateModel_ReturnExpected()
    {
        // Arrange
        var request = new GetTemplateSettingRequest();
        var templateModels = new List<TemplateModel>
        {
            new()
            {
                JsonValue =
                    "[{\"Name\":\"Actual Score\",\"MsgEnglish\":\"Actual Score (EN)\",\"MsgChineseTraditional\":\"Actual Score (TC)\"," +
                    "\"MsgChineseSimplified\":\"Actual Score (SC)\",\"MsgChineseNewSimplified\":\"Actual Score (New SC)\"}]"
            }
        };
        var templateSettings = new List<TemplateSetting> { new() };
        var expectedViewModel = new TemplateSettingViewModel
        {
            MessageTemplates = new List<TemplateModel>
            {
                new()
                {
                    InputTexts = new List<InputText>
                    {
                        new()
                        {
                            Name = "Actual Score",
                            MsgEnglish = "Actual Score (EN)",
                            MsgChineseTraditional = "Actual Score (TC)",
                            MsgChineseSimplified = "Actual Score (SC)",
                            MsgChineseNewSimplified = "Actual Score (New SC)"
                        }
                    },
                    JsonValue = templateModels[0].JsonValue
                }
            },
            TemplateSettings = templateSettings
        };

        repository.FetchAsync<TemplateModel>(Arg.Any<GetTemplatesCriteria>()).Returns(templateModels);
        repository.FetchAsync<TemplateSetting>(Arg.Any<GetTemplateSettingCriteria>()).Returns(templateSettings);
        mapper.Map<TemplateModel>(Arg.Any<TemplateModel>()).Returns(new TemplateModel());

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expectedViewModel, result);
    }
}