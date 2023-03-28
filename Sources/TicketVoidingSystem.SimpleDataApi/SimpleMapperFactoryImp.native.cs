using Olympus.SimpleDataApi;
using TicketVoidingSystem.SimpleDataApi.Mapper;

namespace TicketVoidingSystem.SimpleDataApi;

public class SimpleMapperFactoryImp : SimpleMapperFactoryBase
{
    static SimpleMapperFactoryImp()
    {
        AddSimpleMapperService("soccer-early-get-match", typeof(GoalIconMapperService));
    }
}