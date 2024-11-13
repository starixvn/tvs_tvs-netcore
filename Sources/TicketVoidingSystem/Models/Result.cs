namespace TicketVoidingSystem.Models;

public class Result
{
    public int ErrorCode { get; set; }

    public string ErrorMsg { get; set; } = string.Empty;

    public bool IsSuccessful => string.IsNullOrEmpty(ErrorMsg) || ErrorCode == 0;

    public object Data { get; set; }
}