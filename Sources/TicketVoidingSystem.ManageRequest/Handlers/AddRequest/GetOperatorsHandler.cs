using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetOperatorsRequest : GetOperatorsInfoCriteria, IRequest<IEnumerable<OperatorInfo?>>
{
}

public class GetOperatorsHandler(IDynamicRepository repository)
    : IRequestHandler<GetOperatorsRequest, IEnumerable<OperatorInfo?>>
{
    public async Task<IEnumerable<OperatorInfo?>> Handle(GetOperatorsRequest request, CancellationToken cancellationToken)
    {
        var operators = new List<OperatorInfo?>();
        if (!string.IsNullOrWhiteSpace(request.MatchIds))
        {
            var data = await repository.FetchAsync<OperatorInfoModel>(request);
            operators = UpdateViewModel(data).ToList();
        }

        operators.Insert(0, OperatorConstant.SuspenderNA);
        operators.Insert(0, OperatorConstant.TraderNA);
        return operators;
    }

    private static IEnumerable<OperatorInfo?> UpdateViewModel(IEnumerable<OperatorInfoModel> data)
    {
        if (!data.Any())
        {
            return new List<OperatorInfo?>();
        }

        return data.SelectMany(item => new[] { BuildTraderInfo(item), BuildSuspenderInfo(item) })
            .Where(operatorInfo => operatorInfo != null);
    }

    private static OperatorInfo? BuildTraderInfo(OperatorInfoModel item)
    {
        if (item.TraderID > 0)
        {
            return new OperatorInfo
            {
                MatchId = item.MatchId,
                OperatorId = item.TraderID,
                OperatorType = OperatorConstant.TraderType,
                UserName = item.TraderName
            };
        }
        return null;
    }

    private static OperatorInfo? BuildSuspenderInfo(OperatorInfoModel item)
    {
        if (item.SuspenderID > 0)
        {
            return new OperatorInfo
            {
                MatchId = item.MatchId,
                OperatorId = item.SuspenderID,
                OperatorType = OperatorConstant.SuspenderType,
                UserName = item.SuspenderName
            };
        }
        return null;
    }
}