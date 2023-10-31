using Fanex.Data.Repository;
using MediatR;
using SpecialDelete.VoidByBetId.Criteria;
using SpecialDelete.VoidByBetId.Models;

namespace SpecialDelete.VoidByBetId.Handlers;

public class CheckUserNameRequest : GetCustomerInfoCriteria, IRequest<string>
{
}

public class CheckUserNameHandler : IRequestHandler<CheckUserNameRequest, string>
{
    private readonly IDynamicRepository repository;

    public CheckUserNameHandler(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task<string> Handle(CheckUserNameRequest request, CancellationToken cancellationToken)
    {
        const string invalidCustomer = "0";
        var customerInfoList = await repository.FetchAsync<CustomerInfo>(request, cancellationToken);
        return customerInfoList.Any() ? string.Join(",", customerInfoList.Select(x => x.CustId)) : invalidCustomer;
    }
}