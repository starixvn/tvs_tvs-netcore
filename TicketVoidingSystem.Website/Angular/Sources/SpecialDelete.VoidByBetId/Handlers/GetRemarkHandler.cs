private async IAsyncEnumerable<string> GetRemarksForPermission()
{
    if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidSettledTickets, Constant.Policy.Host))
    {
        yield return StringResource.Warning_Message_VoidBetId;
    }
    else if (await sessionService.HasPermission(SpecialDeleteFunctionKeys.VoidUnsettledTickets, Constant.Policy.Host))
    {
        yield return StringResource.Warning_Message_VoidBetId_UnSettled;
    }
    // Không cần thêm gì cả, nếu không có quyền thì sẽ không yield return gì, tức là trả về mảng trống
} 