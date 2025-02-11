using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Models.BetTypes;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SharedApi.Handlers.BetTypes;

public class GetHdpFilterBetTypesRequest : IRequest<IEnumerable<BetTypeFilterHdpModel>>
{
    public string SportId { get; set; }
    public int IssueTypeId { get; set; }
}

public class GetHdpFilterBetTypesHandler(RemotingRefWrapperService remotingRefWrapperService)
    : IRequestHandler<GetHdpFilterBetTypesRequest, IEnumerable<BetTypeFilterHdpModel>>
{
    public async Task<IEnumerable<BetTypeFilterHdpModel>> Handle(GetHdpFilterBetTypesRequest request, CancellationToken cancellationToken)
    {
        const string jsonPath = "App_Data/Data/HdpFilterBetTypes.json";
        var allBetTypes = Helper.DeserializeJsonFileToObject<HdpFilterBetTypeModel>(jsonPath).BetTypes;
        var filterSport = allBetTypes
            .Where(x => x.IssueType == request.IssueTypeId && x.Sports.Split(",").Contains(request.SportId)) // Filter bet types by issueType & sportType
            .Select(x =>
            {
                x.Name = remotingRefWrapperService.GetBetType(x.BetType, LanguageCode.English);
                return x;
            })
            .ToList();

        return await Task.FromResult(filterSport);
    }
}