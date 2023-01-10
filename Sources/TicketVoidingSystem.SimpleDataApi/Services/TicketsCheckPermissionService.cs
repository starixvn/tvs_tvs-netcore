using System.Text;
using Fanex.Data.Repository;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SimpleDataApi.Criteria;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.SimpleDataApi.Services
{
    public interface TicketsCheckPermissionService
    {
        string GetTicketsCheckPermission(Dictionary<string, object> queryModel);

        IEnumerable<TransInfoModel> GetTransInfoForCheckPermission(Dictionary<string, object> queryModel);
    }

    public class TicketsCheckPermissionServiceImp : TicketsCheckPermissionService
    {
        private readonly IDynamicRepository repository;

        public TicketsCheckPermissionServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public string GetTicketsCheckPermission(Dictionary<string, object> queryModel)
        {
            var tickets = Helper.DeserializeObjectIgnoreNullValue<IEnumerable<BetId>>(queryModel["tickets"].ToString());
            var getTicketModels = new List<GetTicketSiteDbModel>();
            foreach (var server in SiteDbGroupConstant.ServerList)
            {
                var ticketsInSiteDb = tickets.Where(x => x.SiteDbGroupId == server.Id);
                if (!ticketsInSiteDb.Any())
                {
                    continue;
                }

                var criteria = new GetTicketCheckPermissionCriteria
                {
                    SiteDbGroupId = server.Id,
                    TransIds = Helper.JoinBetIdList(ticketsInSiteDb)
                };
                var response = repository.Fetch<GetTicketSiteDbModel>(criteria);
                getTicketModels.AddRange(response);
            }

            return GetTransInfoXml(getTicketModels);
        }

        private static string GetTransInfoXml(IEnumerable<GetTicketSiteDbModel> tickets)
        {
            if (tickets == null)
            {
                return string.Empty;
            }
            var stringBuilder = new StringBuilder();
            foreach (var ticket in tickets)
            {
                var line = $"<r t='{ticket.TransId}' "
                           + $"mid='{ticket.MatchId}' "
                           + $"s_t='{ticket.SubTransId}' "
                           + $"btype='{ticket.BetType}' "
                           + $"bdaq='{ticket.BetdaqId}' "
                           + $"sid='{ticket.StatusId}' "
                           + $"s_sid='{ticket.SubStatusId}' "
                           + $"isP='{ticket.IsMixParlay}' "
                           + $"isM='{ticket.IsMoved14}' "
                           + $"sitedb='{ticket.SiteDbGroupId}' />";
                stringBuilder.AppendLine(line);
            }

            return $"<root>{stringBuilder.ToString().Trim()}</root>";
        }

        public IEnumerable<TransInfoModel> GetTransInfoForCheckPermission(Dictionary<string, object> queryModel)
        {
            var tickets = Helper.DeserializeObjectIgnoreNullValue<IEnumerable<BetId>>(queryModel["tickets"].ToString());
            var transInfoJsonList = new List<TransInfoModel>();
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
                var response = repository.Get<TransInfoModel>(criteria);
                transInfoJsonList.Add(response);
            }

            return transInfoJsonList;
        }
    }
}