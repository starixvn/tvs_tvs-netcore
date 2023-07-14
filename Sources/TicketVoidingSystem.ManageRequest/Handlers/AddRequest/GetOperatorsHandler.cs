using Fanex.Data.Repository;
using MediatR;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequest;

public class GetOperatorsRequest : GetOperatorsInfoCriteria, IRequest<IEnumerable<OperatorInfo>>
{
}

public class GetOperatorsHandler : IRequestHandler<GetOperatorsRequest, IEnumerable<OperatorInfo>>
{
    private readonly IDynamicRepository repository;

    public GetOperatorsHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<IEnumerable<OperatorInfo>> Handle(GetOperatorsRequest request, CancellationToken cancellationToken)
    {
        var operators = new List<OperatorInfo>();
        if (!string.IsNullOrWhiteSpace(request.MatchIds))
        {
            var data = await repository.FetchAsync<OperatorInfoModel>(request, cancellationToken);
            operators = UpdateViewModel(data);
        }

        operators.Insert(0, OperatorConstant.SuspenderNA);
        operators.Insert(0, OperatorConstant.TraderNA);
        return operators;
    }

    private static List<OperatorInfo> UpdateViewModel(IEnumerable<OperatorInfoModel> data)
    {
        if (!data.Any())
        {
            return new List<OperatorInfo>();
        }

        var result = new List<OperatorInfo>();
        foreach (var item in data)
        {
            result.Add(new OperatorInfo
            {
                MatchId = item.MatchId,
                OperatorId = item.TraderID,
                OperatorType = OperatorConstant.TraderType,
                UserName = item.TraderName
            });

            result.Add(new OperatorInfo
            {
                MatchId = item.MatchId,
                OperatorId = item.SuspenderID,
                OperatorType = OperatorConstant.SuspenderType,
                UserName = item.SuspenderName
            });
        }
        return result;
    }
}