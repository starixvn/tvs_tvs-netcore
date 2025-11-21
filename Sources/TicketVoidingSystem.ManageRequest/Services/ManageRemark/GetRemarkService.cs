using Fanex.Data.Repository;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark;

public interface GetRemarkService
{
    Task<AddRemarkModel> GetRemark(int remarkId);
}

public class GetRemarkServiceImp(
    IDynamicRepository repository,
    RequestExtraInfoXmlService requestExtraInfoXmlService)
    : GetRemarkService
{
    public async Task<AddRemarkModel> GetRemark(int remarkId)
    {
        var criteria = new GetRemarkCriteria
        {
            RemarkId = remarkId
        };

        var remark = await repository.GetAsync<AddRemarkModel>(criteria);

        if (remark == null)
        {
            return null;
        }

        var operators = requestExtraInfoXmlService.ParseXmlToOperators(remark.OperatorInfo ?? string.Empty)
            .Select(x => new OperatorQuery { OperatorId = x.OperatorId, OperatorType = x.OperatorType })
            .ToList();

        remark.OperatorsList = operators;

        return remark;
    }
}

