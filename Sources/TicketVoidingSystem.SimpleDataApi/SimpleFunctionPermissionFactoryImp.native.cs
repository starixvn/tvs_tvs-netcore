using Fanex.NAP.Core.Business;
using Olympus.SimpleDataApi;
using TicketVoidingSystem.Web;

namespace TicketVoidingSystem.SimpleDataApi;

public class SimpleFunctionPermissionFactoryImp : SimpleFunctionPermissionFactoryBase
{
    static SimpleFunctionPermissionFactoryImp()
    {
        AddFunctionPermission("soccer-early-get-match", SpecialDeleteFunctionKeys.SportsbookSpecialDelete, Constant.Policy.Read);
    }
}