using MediatR;
using SpecialDelete.UploadBatchMessage.Models;
using TicketVoidingSystem.Utilities;

namespace SpecialDelete.UploadBatchMessage.Handlers;

public class GetProductRequest : IRequest<IEnumerable<Group>>
{
}

public class GetProductsHandler : IRequestHandler<GetProductRequest, IEnumerable<Group>>
{
    public async Task<IEnumerable<Group>> Handle(GetProductRequest request, CancellationToken cancellationToken)
    {
        return await Task.FromResult(GetProductsFromJsonFile());
    }

    private static IEnumerable<Group> GetProductsFromJsonFile()
    {
        const string jsonPath = "App_Data/Data/Products.json";
        return Helper.DeserializeJsonFileToObject<Products>(jsonPath).Groups;
    }
}