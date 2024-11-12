using AutoMapper;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface RenderRequestService
{
    RequestViewModel Render(GroupRequestModel groupRequest);

    RequestViewModel RenderExportExcel(RequestModel item);
}

public class RenderRequestServiceImp(
    IMapper mapper,
    DescriptionService descriptionService,
    RemotingRefWrapperService remotingRefWrapperService,
    MatchService matchService)
    : RenderRequestService
{
    public RequestViewModel Render(GroupRequestModel groupRequest)
    {
        var requestModel = groupRequest.RequestModels.First();
        var viewModel = mapper.Map<RequestViewModel>(requestModel);
        viewModel.CreatedDate = requestModel.CreatedDate.ZoneManila();
        viewModel.Details = new List<RequestEventViewModel>();
        AddEventDetail(viewModel, groupRequest.RequestModels);

        return viewModel;
    }

    public RequestViewModel RenderExportExcel(RequestModel item)
    {
        var viewModel = mapper.Map<RequestViewModel>(item);
        viewModel.CreatedDate = item.CreatedDate.ZoneManila();
        viewModel.Details = new List<RequestEventViewModel>();
        AddEventDetailExportExcel(viewModel, item);

        return viewModel;
    }

    private void AddEventDetailExportExcel(RequestViewModel viewModel, RequestModel model)
    {
        var description = mapper.Map<RequestDescription>(model);
        UpdateRequestDescriptionFromRemotingRef(description);
        var detail = mapper.Map<RequestEventViewModel>(model);
        detail.Description = descriptionService.Build(description);

        viewModel.Details.Add(detail);
    }

    private void AddEventDetail(RequestViewModel viewModel, IEnumerable<RequestModel> requestModels)
    {
        foreach (var model in requestModels)
        {
            var requestDescription = mapper.Map<RequestDescription>(model);
            UpdateRequestDescriptionFromRemotingRef(requestDescription);
            var detail = mapper.Map<RequestEventViewModel>(model);
            detail.Description = descriptionService.Build(requestDescription);

            viewModel.Details.Add(detail);
        }
    }

    private void UpdateRequestDescriptionFromRemotingRef(RequestDescription description)
    {
        description.HomeName = remotingRefWrapperService.GetTeamName(description.SportType, description.HomeId, LanguageCode.English);
        description.AwayName = remotingRefWrapperService.GetTeamName(description.SportType, description.AwayId, LanguageCode.English);
        description.LeagueName = remotingRefWrapperService.GetLeagueName(description.SportType, description.LeagueId, LanguageCode.English);
        description.SportTypeName = remotingRefWrapperService.GetSportName(description.SportType.ToString(), LanguageCode.English);
        description.MatchEvent = matchService.GetMatchEvent(description);
    }
}