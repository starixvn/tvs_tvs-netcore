namespace TicketVoidingSystem.Core.Models
{
    public class Result
    {
        public Result()
        {
            ErrorCode = 0;
            ErrorMsg = string.Empty;
        }

        public int ErrorCode { get; set; }

        public string ErrorMsg { get; set; }

        public bool IsSuccessful => string.IsNullOrEmpty(ErrorMsg) || ErrorCode == 0;

        public object Data { get; set; }
    }
}