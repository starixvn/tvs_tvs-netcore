using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetWrongScoreInfoRequest : GetWrongScoreInfoCriteria, IRequest<IEnumerable<WrongScoreInfoViewModel>>
{
}

public class GetWrongScoreInfoHandler(WrongScoreInfoService wrongScoreInfoService)
    : IRequestHandler<GetWrongScoreInfoRequest, IEnumerable<WrongScoreInfoViewModel>>
{
    public async Task<IEnumerable<WrongScoreInfoViewModel>> Handle(GetWrongScoreInfoRequest request, CancellationToken cancellationToken)
    {
        return await wrongScoreInfoService.GetWrongScoreInfo(request);
    }
}