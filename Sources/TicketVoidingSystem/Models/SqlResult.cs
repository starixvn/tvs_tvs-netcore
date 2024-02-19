namespace TicketVoidingSystem.Models;

public class SqlResult
{
    public SqlResult()
    {
        ErrCode = 0;
        ErrMsg = string.Empty;
    }

    public int ErrCode { get; set; }

    public string ErrMsg { get; set; }
}