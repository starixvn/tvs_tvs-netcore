using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class GetReasonNameRequest : IRequest<VoidedReason>
{
    public int SubId { get; set; }
    public int SportTypeId { get; set; }
}

public class GetReasonNameHandler : IRequestHandler<GetReasonNameRequest, VoidedReason>
{
    private readonly IDynamicRepository repository;
    private readonly BetListService betListService;

    public GetReasonNameHandler(IDynamicRepository repository, BetListService betListService)
    {
        this.repository = repository;
        this.betListService = betListService;
    }

    public async Task<VoidedReason> Handle(GetReasonNameRequest request, CancellationToken cancellationToken)
    {
        var criteria = new GetReasonNameCriteria
        {
            SubIssueTypeId = request.SubId,
            SportType = request.SportTypeId
        };
        var reason = await repository.GetAsync<VoidedReason>(criteria, cancellationToken);

        if (reason == null)
        {
            return new VoidedReason();
        }

        var sportEn = (request.SportTypeId > 0) ? $"{betListService.GetSportTypeName(request.SportTypeId, LanguageCode.English)} - " : "";
        var sportCs = (request.SportTypeId > 0) ? $"{betListService.GetSportTypeName(request.SportTypeId, LanguageCode.ChineseSimplified)} - " : "";
        reason.ReasonEnglish = $"{sportEn}{reason.ReasonEnglish}";
        reason.ReasonChineseSimplified = $"{sportCs}{reason.ReasonChineseSimplified}";
        
        return reason;
    }
}