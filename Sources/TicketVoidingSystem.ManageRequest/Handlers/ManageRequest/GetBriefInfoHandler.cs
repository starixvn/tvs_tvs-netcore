using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetBriefInfoRequest : IRequest<IEnumerable<BriefInfoModel>>
{
    public string MatchIds { get; set; }

    public int RequestId { get; set; }
}

public class GetBriefInfoHandler : IRequestHandler<GetBriefInfoRequest, IEnumerable<BriefInfoModel>>
{
    private readonly IDynamicRepository repository;

    public GetBriefInfoHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<BriefInfoModel>> Handle(GetBriefInfoRequest request, CancellationToken cancellationToken)
    {
        var briefInfoModels = new List<BriefInfoModel>();
        var (sourceGeneralInfo, sourceUserVoidMessages) = await GetGeneralInfo(request.RequestId, request.MatchIds);
        var licenseInAllServers = await GetTicketLicenseeTicket(sourceGeneralInfo.Select(x => x.VoidingHistoryIds));

        if (sourceGeneralInfo.Count() == 1)
        {
            briefInfoModels.Add(GetBriefInfoModel(0, licenseInAllServers, sourceUserVoidMessages));
        }
        else
        {
            briefInfoModels.AddRange(
               sourceGeneralInfo.Select(item =>
                {
                    var sourceUserVoidMessageOfMatch = sourceUserVoidMessages.Where(x => x.MatchId == item.MatchId);
                    var licenseInAllServersOfMatch = licenseInAllServers.Where(x => x.MatchId == item.MatchId);

                    return GetBriefInfoModel(item.MatchId, licenseInAllServersOfMatch, sourceUserVoidMessageOfMatch);
                })
            );
        }

        return briefInfoModels;
    }

    public BriefInfoModel GetBriefInfoModel(int? matchId, IEnumerable<TicketLicenseeModel> licensees, IEnumerable<UserVoidMessage> userVoidMessages)
    {
        return new BriefInfoModel
        {
            MatchId = matchId,
            AffectedLicenseeNames = Helper.GetUnionTransIdString(licensees.Select(x => x.AffectedLicenseeNames), ", "),
            CancelCashOutLicenseesNames = Helper.GetUnionTransIdString(licensees.Select(x => x.CancelCashOutLicenseesNames), ", "),
            ChinaViewLicenseesNames = Helper.GetUnionTransIdString(licensees.Select(x => x.ChinaViewLicenseesNames), ", "),
            UserVoidMessages = userVoidMessages
        };
    }

    public async Task<(IEnumerable<GeneralInfoModel>, IEnumerable<UserVoidMessage>)> GetGeneralInfo(int requestId, string matchIds)
    {
        var criteria = new GetGeneralInfoCriteria
        {
            RequestId = requestId,
            MatchIds = matchIds
        };
        var (sourceGeneralInfo, sourceUserVoidMessages, _)
            = await repository.FetchMultipleAsync<GeneralInfoModel, UserVoidMessage, EmailResultModel>(criteria);

        return (sourceGeneralInfo, sourceUserVoidMessages);
    }

    public async Task<IEnumerable<TicketLicenseeModel>> GetTicketLicenseeTicket(IEnumerable<string> voidingHistoryIds)
    {
        var getLicenseCriteria = new GetBriefInfoCriteria
        {
            VoidingHistoryIds = string.Join(",", Helper.GetIntersectTransIdString(voidingHistoryIds))
        };

        var tasks = SiteDbGroupConstant.ServerList.Select(server =>
        {
            getLicenseCriteria.SiteDbGroupId = server.Id;
            return repository.FetchAsync<TicketLicenseeModel>(getLicenseCriteria);
        });

        var results = await Task.WhenAll(tasks);

        return results.SelectMany(x => x);
    }
}