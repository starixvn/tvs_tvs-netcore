using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TicketVoidingSystem.Extensions;

public static class EmailExtension
{
    public static string ToOperatorsXml(this IEnumerable<int> agentIds)
    {
        if (agentIds == null || !agentIds.Any())
        {
            return string.Empty;
        }

        var stringBuilder = new StringBuilder();
        foreach (var agentId in agentIds)
        {
            var line = $"<Operator AgentId='{agentId}' />";
            stringBuilder.AppendLine(line);
        }

        return $"<Operators>{stringBuilder.ToString().Trim()}</Operators>";
    }
}