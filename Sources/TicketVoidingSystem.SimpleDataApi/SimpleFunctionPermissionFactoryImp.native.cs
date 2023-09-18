using Olympus.SimpleDataApi;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.SimpleDataApi;

using Fanex.NAP.Client.Helpers.Business;

public class SimpleFunctionPermissionFactoryImp : SimpleFunctionPermissionFactoryBase
{
    static SimpleFunctionPermissionFactoryImp()
    {
        AddFunctionPermission("soccer-early-get-match", SpecialDeleteFunctionKeys.SportsbookSpecialDelete, Constant.Policy.Read);
    }
}