using MediatR;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetGeneralInfoRequest : GetGeneralInfoCriteria, IRequest<GeneralInfoViewModel>
{
}

public class GetGeneralInfoHandler(GetGeneralInfoService getGeneralInfoService)
    : IRequestHandler<GetGeneralInfoRequest, GeneralInfoViewModel>
{
    public async Task<GeneralInfoViewModel> Handle(GetGeneralInfoRequest request, CancellationToken cancellationToken)
    {
        return await getGeneralInfoService.GetGeneralInfoViewModel(request);
    }
}