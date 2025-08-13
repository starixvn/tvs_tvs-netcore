using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;

public class GetReasonNameRequest : IRequest<VoidedReason>
{
    public int SubId { get; set; }
    public int SportTypeId { get; set; }
}

public class GetReasonNameHandler(IDynamicRepository repository, BetListService betListService)
    : IRequestHandler<GetReasonNameRequest, VoidedReason>
{
    public async Task<VoidedReason> Handle(GetReasonNameRequest request, CancellationToken cancellationToken)
    {
        var voidedReason = await GetVoidedReason(request);
        if (voidedReason == null)
        {
            return new VoidedReason();
        }

        var sportEn = request.SportTypeId > 0 ? $"{betListService.GetSportTypeName(request.SportTypeId, LanguageCode.English)} - " : "";
        var sportCs = request.SportTypeId > 0 ? $"{betListService.GetSportTypeName(request.SportTypeId, LanguageCode.ChineseSimplified)} - " : "";
        voidedReason.ReasonEnglish = $"{sportEn}{voidedReason.ReasonEnglish}";
        voidedReason.ReasonChineseSimplified = $"{sportCs}{voidedReason.ReasonChineseSimplified}";

        return voidedReason;
    }

    private async Task<VoidedReason?> GetVoidedReason(GetReasonNameRequest request)
    {
        var criteria = new GetReasonNameCriteria
        {
            SubIssueTypeId = request.SubId,
            SportType = request.SportTypeId
        };

        return await repository.GetAsync<VoidedReason>(criteria);
    }
}