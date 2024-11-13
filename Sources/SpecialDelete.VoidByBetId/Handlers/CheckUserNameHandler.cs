using Fanex.Data.Repository;
using MediatR;
using SpecialDelete.VoidByBetId.Criteria;
using SpecialDelete.VoidByBetId.Models;

namespace SpecialDelete.VoidByBetId.Handlers;

public class CheckUserNameRequest : GetCustomerInfoCriteria, IRequest<string>;

public class CheckUserNameHandler(IDynamicRepository repository) : IRequestHandler<CheckUserNameRequest, string>
{
    public async Task<string> Handle(CheckUserNameRequest request, CancellationToken cancellationToken)
    {
        const string invalidCustomer = "0";
        var customerInfoList = await repository.FetchAsync<CustomerInfo>(request);
        return customerInfoList.Any() ? string.Join(",", customerInfoList.Select(x => x.CustId)) : invalidCustomer;
    }
}