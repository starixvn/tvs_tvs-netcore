using Microsoft.Extensions.DependencyInjection;
using WebOptimizer;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class RecoverParlayBetBundle
{
    public static void AddRecoverParlayBetBundle(this IAssetPipeline pipeline)
    {
        //// style bundle
        pipeline.AddLessBundle("/old-page/bundle/recover-parlay-bet.css", "old-page/recover-parlay-bet/recover-parlay-bet.less");

        //// script bundle
        pipeline.AddJavaScriptBundle("/old-page/bundle/recover-parlay-bet.js",
            "old-page/scripts/_libs/ContextMenu/jquery.contextMenu.js",
            "old-page/scripts/_libs/Utils/stdlib.js",
            "old-page/scripts/Common/ContextMenu.Helper.js",
            "old-page/scripts/Common/Message.Helper.js",
            "old-page/recover-parlay-bet/scripts/recover-parlay-bet.js",
            "old-page/recover-parlay-bet/scripts/recover-parlay-directive.js",
            "old-page/recover-parlay-bet/scripts/recover-parlay-service.js",
            "old-page/recover-parlay-bet/scripts/recover-parlay-validation.js",
            "old-page/scripts/sub-parlay-ticket.js");
    }
}