using Fanex.Data.Repository;

namespace TicketVoidingSystem.SharedApi.Criteria.Permission;

public abstract class CheckVoidBetPermissionCriteria : NonQueryCommand
{
    public int? MatchId { get; set; }

    public bool IsCheckForTVS { get; set; }

    public bool? IsCashOutAsUnSettledTicket { get; set; }

    public bool IsHostVoidSettledTickets { get; set; }

    public bool IsHostVoidInstantlySettledTickets { get; set; }

    public bool IsHostVoidUnsettledTickets { get; set; }

    public string TransInfoJson { get; set; }

    public int ErrCode { get; set; }

    public string ErrMsg { get; set; }

    public override string GetSettingKey() => "TicketVoiding_CheckVoidBetPermission";

    public abstract override bool IsValid();
}

public class CheckVoidBetPermissionVoidByBetIdCriteria : CheckVoidBetPermissionCriteria
{
    public override bool IsValid() => MatchId == null;
}

public class CheckVoidBetPermissionVoidSingleBetCriteria : CheckVoidBetPermissionCriteria
{
    public override bool IsValid() => MatchId is > 0;
}

public class CheckVoidBetPermissionVoidParlayBetCriteria : CheckVoidBetPermissionCriteria
{
    public override bool IsValid() => MatchId == null;
}

public class CheckVoidBetPermissionVoidByCurrencyCriteria : CheckVoidBetPermissionCriteria
{
    public override bool IsValid() => MatchId == null;
}

public class CheckVoidBetPermissionVoidCashOutTransactionCriteria : CheckVoidBetPermissionCriteria
{
    public override bool IsValid() => MatchId == null;
}

public class CheckVoidBetPermissionTicketVoidingCriteria : CheckVoidBetPermissionCriteria
{
    public override bool IsValid() => MatchId.HasValue;
}

public class CheckPermissionMarkTicketsCriteria : CheckVoidBetPermissionCriteria
{
    public override bool IsValid() => MatchId == null;
}