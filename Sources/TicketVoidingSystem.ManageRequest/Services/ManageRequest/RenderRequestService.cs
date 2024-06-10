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

    void UpdateRequestDetailProperties(int issueTypeId, IEnumerable<RequestEventModel> models);
}

public class RenderRequestServiceImp : RenderRequestService
{
    private readonly IMapper mapper;
    private readonly DescriptionService descriptionService;
    private readonly RemotingRefWrapperService remotingRefWrapperService;

    public RenderRequestServiceImp(IMapper mapper, DescriptionService descriptionService,
        RemotingRefWrapperService remotingRefWrapperService)
    {
        this.mapper = mapper;
        this.descriptionService = descriptionService;
        this.remotingRefWrapperService = remotingRefWrapperService;
    }

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
        description.HomeName = remotingRefWrapperService.GetTeamName(description.HomeId, LanguageCode.English);
        description.AwayName = remotingRefWrapperService.GetTeamName(description.AwayId, LanguageCode.English);
        description.LeagueName = remotingRefWrapperService.GetLeagueName(description.LeagueId, LanguageCode.English);
        description.SportTypeName = remotingRefWrapperService.GetSportName(description.SportType.ToString(), LanguageCode.English);
    }

    public void UpdateRequestDetailProperties(int issueTypeId, IEnumerable<RequestEventModel> models)
    {
        var issueTypesHasJsonFormat = new[] { IssueTypeConstant.WrongMarketOffered, IssueTypeConstant.TechnicalError };
        if (!issueTypesHasJsonFormat.Contains(issueTypeId))
        {
            foreach (var model in models)
            {
                var root = model.RequestExtraInfo.ParseXmlToObject<RequestExtraInfoXml>();
                model.AATime = string.IsNullOrWhiteSpace(root.AATime) ? null : int.Parse(root.AATime);
                model.PATime = string.IsNullOrWhiteSpace(root.PATime) ? null : int.Parse(root.PATime);
                model.SATime = string.IsNullOrWhiteSpace(root.SATime) ? null : int.Parse(root.SATime);
                model.ScoreId = string.IsNullOrWhiteSpace(root.ScoreId) ? 0 : int.Parse(root.ScoreId);

                model.IsMainMatch = root.IsMainMatch;
                model.HomeFavorite = root.HomeFavorite;
                model.AwayFavorite = root.AwayFavorite;
                model.ActualMarket = root.ActualMarket;
                model.WrongMarket = root.WrongMarket;
                model.HdpValue = root.HdpValue;
                model.IsCheckedVar = root.IsCheckedVar;
                model.PoolHouseCheckedBetTypes = root.PoolHouseCheckedBetTypes;
                model.IsLinkGroup1X2 = root.IsLinkGroup1X2;
                model.IsLinkGroupAIO = root.IsLinkGroupAIO;
                model.LiveIndicator = root.LiveIndicator;
                model.FilterOddsType = root.FilterOddsType;
                model.FilterFavoriteType = root.FilterFavoriteType;
                model.FilterOuType = root.FilterOuType;
                model.OddsValue = root.OddsValue;
                model.FromOdds = root.FromOdds;
                model.ToOdds = root.ToOdds;
                model.CorrectOdds = root.CorrectOdds;
                model.BetTeam = root.BetTeam;
                model.OuValue = root.OuValue;
                model.FavoriteValue = root.FavoriteValue;
                model.BetTypeIds = root.BetTypeIds;
                model.WicketOver = root.WicketOver;
                model.PlayerIds = root.PlayerIds;
                model.Runs = root.Runs;
                model.Live = root.Live;
                model.NonLive = root.NonLive;
                model.PlayerId = root.PlayerId;
            }
        }
    }
}