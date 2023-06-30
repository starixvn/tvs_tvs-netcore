using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetWrongScoreInfoRequest : GetWrongScoreInfoCriteria, IRequest<IEnumerable<WrongScoreInfoViewModel>>
{
}

public class GetWrongScoreInfoHandler : IRequestHandler<GetWrongScoreInfoRequest, IEnumerable<WrongScoreInfoViewModel>>
{
    private readonly WrongScoreInfoService wrongScoreInfoService;

    public GetWrongScoreInfoHandler(WrongScoreInfoService wrongScoreInfoService)
    {
        this.wrongScoreInfoService = wrongScoreInfoService;
    }

    public async Task<IEnumerable<WrongScoreInfoViewModel>> Handle(GetWrongScoreInfoRequest request, CancellationToken cancellationToken)
    {
        return await wrongScoreInfoService.GetWrongScoreInfo(request);
    }
}