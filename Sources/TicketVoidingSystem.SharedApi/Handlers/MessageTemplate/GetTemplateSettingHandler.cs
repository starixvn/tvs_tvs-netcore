using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.SharedApi.Criteria.MessageTemplate;
using TicketVoidingSystem.SharedApi.Models.MessageTemplate;
using TicketVoidingSystem.SharedApi.ViewModels.MessageTemplate;

namespace TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;

public class GetTemplateSettingRequest : IRequest<TemplateSettingViewModel>
{
}

public class GetTemplateSettingHandler : IRequestHandler<GetTemplateSettingRequest, TemplateSettingViewModel>
{
    private readonly IDynamicRepository repository;
    private readonly IMapper mapper;

    public GetTemplateSettingHandler(IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<TemplateSettingViewModel> Handle(GetTemplateSettingRequest request, CancellationToken cancellationToken)
    {
        var templateModels = await repository.FetchAsync<TemplateModel>(new GetTemplatesCriteria());
        var templateSettings = await repository.FetchAsync<TemplateSetting>(new GetTemplateSettingCriteria());
        var messageTemplates = templateModels.Select(MapToMessageTemplateViewModels);

        return new TemplateSettingViewModel
        {
            MessageTemplates = messageTemplates,
            TemplateSettings = templateSettings
        };
    }

    private MessageTemplateViewModel MapToMessageTemplateViewModels(TemplateModel template)
    {
        var viewModel = mapper.Map<MessageTemplateViewModel>(template);
        viewModel.InputTexts = string.IsNullOrWhiteSpace(template.JsonValue) ?
            new List<InputText>() : JsonSerializer.Deserialize<IEnumerable<InputText>>(template.JsonValue);

        return viewModel;
    }
}