using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest;

public interface GetGeneralInfoService
{
    Task<GeneralInfoViewModel> GetGeneralInfoViewModel(GetGeneralInfoCriteria message);
}

public class GetGeneralInfoServiceImp : GetGeneralInfoService
{
    private readonly RemotingRefWrapperService remotingRefService;
    private readonly IDynamicRepository repository;

    public GetGeneralInfoServiceImp(
        RemotingRefWrapperService remotingRefService,
        IDynamicRepository repository)
    {
        this.remotingRefService = remotingRefService;
        this.repository = repository;
    }

    public async Task<GeneralInfoViewModel> GetGeneralInfoViewModel(GetGeneralInfoCriteria message)
    {
        var (sourceGeneralInfo, sourceUserVoidMessages, sourceEmailResults)
            = await repository.FetchMultipleAsync<GeneralInfoModel, UserVoidMessage, EmailResultModel>(message);
        var generalInfo = GetGeneralInfoModel(sourceGeneralInfo);
        var viewModel = new GeneralInfoViewModel
        {
            GeneralInfoModel = generalInfo,
            UserVoidMessages = sourceUserVoidMessages.GroupBy(x => x.VoidedBy)
                .Select(group => new GroupUserVoidMessage
                {
                    VoidedBy = group.Key,
                    Messages = group
                }),
            SucceedEmails = sourceEmailResults
                .Where(x => x.Type == VoidBetResultCode.SendEmailToLicenseeSuccess)
                .Select(x => x.Message).Distinct(),
            FailedEmails = sourceEmailResults
                .Where(x => x.Type == VoidBetResultCode.SendEmailToLicenseeFail)
                .Select(x => x.Message).Distinct()
        };

        return viewModel;
    }

    private GeneralInfoModel GetGeneralInfoModel(IEnumerable<GeneralInfoModel> generalInfoModel)
    {
        var generalInfo = generalInfoModel.FirstOrDefault() ?? new GeneralInfoModel();
        generalInfo.LeagueName = remotingRefService.GetLeagueName(generalInfo.LeagueId, LanguageCode.English);
        generalInfo.VoidedTimeString = generalInfo.VoidedTime.ZoneManila().ToString("dd/MM/yyyy - hh:mm:ss tt");
        generalInfo.KickOffTimeString = generalInfo.KickOffTime.ToString("hh:mm tt");
        generalInfo.NegativeBalanceUsers = !string.IsNullOrWhiteSpace(generalInfo.NegativeBalanceUsers)
            ? string.Join(", ", generalInfo.NegativeBalanceUsers.Split(',')) : generalInfo.NegativeBalanceUsers;
        generalInfo.MatchEvent = generalInfo.HomeId > 0 && generalInfo.AwayId > 0
            ? $"{remotingRefService.GetTeamName(generalInfo.HomeId, LanguageCode.English)} - vs - {remotingRefService.GetTeamName(generalInfo.AwayId, LanguageCode.English)}"
            : generalInfo.MatchEvent;

        return generalInfo;
    }
}