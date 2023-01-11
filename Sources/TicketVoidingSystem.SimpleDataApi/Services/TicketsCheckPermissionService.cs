using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SimpleDataApi.Criteria;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SimpleDataApi.Services
{
    public interface TicketsCheckPermissionService
    {
        IEnumerable<string> GetTransInfoForCheckPermission(Dictionary<string, object> queryModel);
    }

    public class TicketsCheckPermissionServiceImp : TicketsCheckPermissionService
    {
        private readonly IDynamicRepository repository;

        public TicketsCheckPermissionServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public IEnumerable<string> GetTransInfoForCheckPermission(Dictionary<string, object> queryModel)
        {
            var tickets = Helper.DeserializeObjectIgnoreNullValue<IEnumerable<BetId>>(queryModel["tickets"].ToString());
            var transInfoJsonList = new List<string>();
            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == server.Id);
                if (!ticketsInSiteDb.Any())
                {
                    continue;
                }

                var criteria = new GetTransInfoForCheckPermissionCriteria
                {
                    SiteDbGroupId = server.Id,
                    TransIds = Helper.JoinBetIdList(ticketsInSiteDb)
                };
                var response = repository.Get<string>(criteria);
                transInfoJsonList.Add(response);
            }

            return transInfoJsonList;
        }
    }
}