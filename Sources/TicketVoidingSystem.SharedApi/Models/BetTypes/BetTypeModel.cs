namespace TicketVoidingSystem.SharedApi.Models.BetTypes
{
    public class BetTypeModel
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public bool LiveIndicator { get; set; }

        public int Type { get; set; }

        public string GroupName { get; set; }
    }
}