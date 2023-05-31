using System.Collections.Generic;
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
        var messageTemplates = new List<MessageTemplateViewModel>();
        var templateModels = await repository.FetchAsync<TemplateModel>(new GetTemplatesCriteria(), cancellationToken);
        var templateSettings = await repository.FetchAsync<TemplateSetting>(new GetTemplateSettingCriteria(), cancellationToken);

        // Jacob Tách phần bên trong loop ra 1 hàm, và xài linQ
        foreach (var item in templateModels)
        {
            var viewModel = mapper.Map<MessageTemplateViewModel>(item);
            viewModel.InputTexts = string.IsNullOrWhiteSpace(item.JsonValue) ?
                new List<InputText>() : JsonSerializer.Deserialize<IEnumerable<InputText>>(item.JsonValue);

            messageTemplates.Add(viewModel);
        }

        return new TemplateSettingViewModel
        {
            MessageTemplates = messageTemplates,
            TemplateSettings = templateSettings
        };
    }
}