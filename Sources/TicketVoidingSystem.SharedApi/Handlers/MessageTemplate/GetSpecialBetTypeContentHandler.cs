using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Models.SendEmail;
using TicketVoidingSystem.SharedApi.Services.MessageTemplate;

namespace TicketVoidingSystem.SharedApi.Handlers.MessageTemplate;

public class GetSpecialBetTypeContentRequest : IRequest<TemplateContentModel>
{
    public IEnumerable<TicketEmailModel> Tickets { get; set; }
}

public class GetSpecialBetTypeContentHandler : IRequestHandler<GetSpecialBetTypeContentRequest, TemplateContentModel>
{
    private readonly SpecialBetTypeContentService specialBetTypeContentService;

    public GetSpecialBetTypeContentHandler(SpecialBetTypeContentService specialBetTypeContentService)
    {
        this.specialBetTypeContentService = specialBetTypeContentService;
    }

    public async Task<TemplateContentModel> Handle(GetSpecialBetTypeContentRequest request, CancellationToken cancellationToken)
    {
        return await Task.FromResult(specialBetTypeContentService.GetContentForVoidPage(request.Tickets));
    }
}