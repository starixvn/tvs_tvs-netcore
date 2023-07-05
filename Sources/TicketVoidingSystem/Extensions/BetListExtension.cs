namespace TicketVoidingSystem.Extensions;

public static class BetListExtension
{
    private const int WallType = 2;

    public static byte SetWalletType(this byte walletType, long? refCode)
    {
        return (byte)(walletType == WallType && (refCode == 0 || refCode == null) ? 0 : walletType);
    }
}